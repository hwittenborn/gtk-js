import postcss, { type Plugin } from "postcss";
import type { CompileOptions } from "./compile.ts";
import { ALL_SELECTORS } from "./selectors.ts";

/**
 * Pre-processes raw sassc output to remove GTK-specific syntax that
 * isn't valid CSS and would prevent PostCSS from parsing.
 *
 * This is a text-based pass that runs BEFORE PostCSS parsing.
 */
export function preprocess(rawCSS: string, options?: CompileOptions): string {
  const lines = rawCSS.split("\n");
  const { scheme, accentColor } = options ?? {};

  // Pass 1: Collect @define-color values, separating light (top-level) from
  // dark (inside @media (prefers-color-scheme: dark)).
  // Light values are used as defaults when resolving @name references.
  const accentSeed = accentColor ?? "#3584e4";
  const lightColors = new Map<string, string>([
    // Runtime-only colors set by adw-style-manager.c, never in stylesheet
    ["accent_bg_color", accentSeed],
    ["accent_fg_color", "white"],
  ]);
  const darkColors = new Map<string, string>([
    ["accent_bg_color", accentSeed],
    ["accent_fg_color", "white"],
  ]);

  let insideDarkMedia = false;
  let braceDepth = 0;

  for (const line of lines) {
    const trimmed = line.trim();

    // Track whether we're inside a @media (prefers-color-scheme: dark) block
    if (trimmed.includes("prefers-color-scheme: dark")) {
      insideDarkMedia = true;
      braceDepth = 0;
    }
    if (insideDarkMedia) {
      for (const ch of trimmed) {
        if (ch === "{") braceDepth++;
        if (ch === "}") braceDepth--;
      }
      if (braceDepth <= 0 && trimmed.includes("}")) {
        insideDarkMedia = false;
      }
    }

    // Collect @define-color declarations
    const defineMatches = trimmed.matchAll(/@define-color\s+(\S+)\s+([^;]+);/g);
    for (const m of defineMatches) {
      if (insideDarkMedia) {
        darkColors.set(m[1]!, m[2]!);
      } else {
        lightColors.set(m[1]!, m[2]!);
        if (!darkColors.has(m[1]!)) {
          darkColors.set(m[1]!, m[2]!);
        }
      }
    }
  }

  // Resolve @name references within a color value using the given color map
  function resolveColorRef(value: string, colors: Map<string, string>, depth = 0): string {
    if (depth > 10) return value; // prevent infinite recursion
    return value.replace(/@([a-z][a-z0-9]*(?:_[a-z0-9]+)*)/g, (_m, name: string) => {
      const resolved = colors.get(name);
      if (resolved) return resolveColorRef(resolved, colors, depth + 1);
      return `var(--${name.replace(/_/g, "-")})`;
    });
  }

  // Pass 2: Strip @define-color lines and resolve @name references.
  const output: string[] = [];
  for (const line of lines) {
    const trimmed = line.trim();

    // Strip @define-color lines
    if (trimmed.startsWith("@define-color ")) {
      continue;
    }

    // Handle @define-color inside @media blocks
    if (trimmed.includes("@define-color ")) {
      const cleaned = line.replace(/@define-color\s+\S+\s+[^;]+;\s*/g, "");
      const inner = cleaned.replace(/@media\s*\([^)]+\)\s*\{\s*\}/, "").trim();
      if (inner === "" || inner === "}" || cleaned.trim() === "}") {
        if (cleaned.trim() === "}") {
          output.push(cleaned);
        }
        continue;
      }
      output.push(cleaned);
      continue;
    }

    output.push(line);
  }

  let result = output.join("\n");

  // Convert remaining GTK @color_name references to resolved values.
  // Uses light colors as default since they appear at the top level.
  // Must NOT match @media, @keyframes, @import, etc. — those have no underscores.
  result = result.replace(/@([a-z][a-z0-9]*(?:_[a-z0-9]+)+)/g, (_match, name: string) => {
    const defined = lightColors.get(name);
    if (defined) {
      return resolveColorRef(defined, lightColors);
    }
    return `var(--${name.replace(/_/g, "-")})`;
  });

  // Collect per-scheme color variable differences
  const darkOverrides: string[] = [];
  for (const [name, darkVal] of darkColors) {
    const lightVal = lightColors.get(name);
    const resolvedDark = resolveColorRef(darkVal, darkColors);
    const resolvedLight = lightVal ? resolveColorRef(lightVal, lightColors) : null;
    if (resolvedDark !== resolvedLight) {
      darkOverrides.push(`    --${name.replace(/_/g, "-")}: ${resolvedDark};`);
    }
  }

  if (scheme === "dark") {
    // Dark-only output: rewrite base :root variables to dark values, emit nothing else
    if (darkOverrides.length > 0) {
      result += `\n:root {\n${darkOverrides.join("\n")}\n}\n`;
    }
  } else if (scheme === "light") {
    // Light-only output: no dark overrides at all — light values are already the base
  } else {
    // Default: emit both @media and [data-color-scheme] overrides (auto behavior)
    if (darkOverrides.length > 0) {
      result += `\n@media (prefers-color-scheme: dark) {\n  :root {\n${darkOverrides.join("\n")}\n  }\n}\n`;
      result += `\n[data-gtk-provider][data-color-scheme="dark"] {\n${darkOverrides.join("\n")}\n}\n`;
    }

    const lightOverrides = [...lightColors.entries()]
      .filter(([name]) => darkColors.has(name))
      .map(
        ([name, val]) => `  --${name.replace(/_/g, "-")}: ${resolveColorRef(val, lightColors)};`,
      );
    if (lightOverrides.length > 0) {
      result += `\n[data-gtk-provider][data-color-scheme="light"] {\n${lightOverrides.join("\n")}\n}\n`;
    }
  }

  return result;
}

/**
 * Builds a regex that matches bare GTK selectors as whole words in a CSS selector string.
 * Matches `button` but not `.button` or `#button` or `-button`.
 */
function buildSelectorRegex(): RegExp {
  // Sort by length descending so longer names match first (e.g. "toggle-group" before "toggle")
  const names = Object.keys(ALL_SELECTORS).sort((a, b) => b.length - a.length);
  // Match bare names that are:
  // - At the start of the selector, or preceded by whitespace, >, +, ~, or comma
  // - NOT preceded by . # - or another letter (which would mean it's a class, id, or part of another word)
  const pattern = names.map((n) => n.replace(/-/g, "\\-")).join("|");
  return new RegExp(`(?<![.#\\w-])(${pattern})(?=[.#:\\[\\s>,+~){]|$)`, "g");
}

const selectorRegex = buildSelectorRegex();

/**
 * PostCSS plugin: Remap bare GTK widget selectors to .gtk-* class selectors.
 */
const remapSelectors: Plugin = {
  postcssPlugin: "gtk-remap-selectors",
  Rule(rule) {
    const original = rule.selector;
    const remapped = original.replace(selectorRegex, (match) => {
      return ALL_SELECTORS[match] ?? match;
    });
    if (remapped !== original) {
      rule.selector = remapped;
    }
  },
};

/**
 * PostCSS plugin: Remap GTK-specific pseudo-classes to data attributes.
 */
const remapPseudoClasses: Plugin = {
  postcssPlugin: "gtk-remap-pseudo-classes",
  Rule(rule) {
    let sel = rule.selector;

    // :backdrop → [data-backdrop]
    sel = sel.replace(/:backdrop/g, "[data-backdrop]");

    // :drop(active) → [data-drop-active]
    sel = sel.replace(/:drop\(active\)/g, "[data-drop-active]");

    // :selected → [aria-selected="true"]
    sel = sel.replace(/:selected/g, '[aria-selected="true"]');

    // :checked → [data-checked] (GTK uses checked state for toggles/spinners)
    sel = sel.replace(/:checked/g, "[data-checked]");

    if (sel !== rule.selector) {
      rule.selector = sel;
    }
  },
};

/**
 * PostCSS plugin: Handle -gtk-* vendor properties.
 */
const handleGtkProperties: Plugin = {
  postcssPlugin: "gtk-handle-properties",
  Declaration(decl) {
    // Strip GTK3-style uppercase widget properties: -GtkWidget-*, -GtkDialog-*, etc.
    if (/^-Gtk[A-Z]/.test(decl.prop)) {
      decl.remove();
      return;
    }

    if (!decl.prop.startsWith("-gtk-")) return;

    switch (decl.prop) {
      case "-gtk-icon-transform":
        // -gtk-icon-transform → transform (just strip the -gtk- prefix)
        decl.prop = "transform";
        break;

      case "-gtk-icon-shadow":
        // -gtk-icon-shadow → filter: drop-shadow(...)
        decl.prop = "filter";
        decl.value = decl.value
          .split(",")
          .map((shadow) => `drop-shadow(${shadow.trim()})`)
          .join(" ");
        break;

      case "-gtk-icon-size":
        // Convert to a CSS custom property that components can read
        decl.prop = "--gtk-icon-size";
        break;

      case "-gtk-icon-palette":
      case "-gtk-icon-source":
      case "-gtk-icon-style":
      case "-gtk-icon-filter":
      case "-gtk-icon-weight":
      case "-gtk-dpi":
      case "-gtk-secondary-caret-color":
        // Remove — handled by React components or not applicable on web
        decl.remove();
        break;

      default:
        // Unknown -gtk- property — convert to CSS custom property as fallback
        decl.prop = `--${decl.prop.slice(1)}`;
        break;
    }
  },
};

/**
 * PostCSS plugin: Replace CSS image() function with linear-gradient() fallback.
 * image(color) → linear-gradient(color, color)
 */
/**
 * Extract the content of a balanced parenthesized expression starting at `start`.
 * `start` should point to the opening `(`. Returns the content between parens
 * and the index after the closing `)`.
 */
function extractBalancedParens(
  str: string,
  start: number,
): { content: string; end: number } | null {
  if (str[start] !== "(") return null;
  let depth = 0;
  for (let i = start; i < str.length; i++) {
    if (str[i] === "(") depth++;
    if (str[i] === ")") depth--;
    if (depth === 0) {
      return { content: str.slice(start + 1, i), end: i + 1 };
    }
  }
  return null;
}

const replaceImageFunction: Plugin = {
  postcssPlugin: "gtk-replace-image-function",
  Declaration(decl) {
    if (!decl.value.includes("image(")) return;

    // Find each `image(` that isn't part of another function name
    let result = "";
    let i = 0;
    const val = decl.value;

    while (i < val.length) {
      const match = val.indexOf("image(", i);
      if (match === -1) {
        result += val.slice(i);
        break;
      }

      // Check it's not part of another word (e.g. background-image)
      if (match > 0 && /[a-z-]/i.test(val[match - 1]!)) {
        result += val.slice(i, match + 6);
        i = match + 6;
        continue;
      }

      // Extract balanced parens content
      const parens = extractBalancedParens(val, match + 5);
      if (!parens) {
        result += val.slice(i, match + 6);
        i = match + 6;
        continue;
      }

      // GTK's image(color) creates a solid-color image layer.
      // Convert to linear-gradient(color, color) which is the web equivalent.
      // This preserves layering behavior: background-image layers ON TOP of
      // background-color, so hover overlays work correctly.
      result += val.slice(i, match);
      result += `linear-gradient(${parens.content}, ${parens.content})`;
      i = parens.end;
    }

    decl.value = result;
  },
};

/**
 * PostCSS plugin: Fix transition properties that reference -gtk-icon-transform.
 */
const fixGtkTransitionRefs: Plugin = {
  postcssPlugin: "gtk-fix-transition-refs",
  Declaration(decl) {
    if (decl.prop.startsWith("transition") && decl.value.includes("-gtk-icon-transform")) {
      decl.value = decl.value.replace(/-gtk-icon-transform/g, "transform");
    }
  },
};

/**
 * PostCSS plugin: Remove -gtk-recolor() function references.
 */
const removeGtkRecolor: Plugin = {
  postcssPlugin: "gtk-remove-recolor",
  Declaration(decl) {
    if (decl.value.includes("-gtk-recolor(") || decl.value.includes("-gtk-icontheme(")) {
      decl.remove();
    }
  },
};

/**
 * PostCSS plugin: Remove -gtk-scaled() declarations (not resolvable at runtime).
 * Asset embedding is handled at build time in compile.ts via makeGtkAssetPlugin.
 */
const removeGtkAssetFunctions: Plugin = {
  postcssPlugin: "gtk-remove-asset-functions",
  Declaration(decl) {
    if (decl.value.includes("-gtk-scaled(")) {
      decl.remove();
    }
  },
};

/**
 * PostCSS plugin: Rewrite color-mix(in srgb, ...) to color-mix(in oklab, ...).
 *
 * GTK's CSS engine does NOT apply gamut mapping when converting colors to sRGB
 * for color-mix interpolation:
 *   https://gitlab.gnome.org/GNOME/gtk/-/blob/5957885ec/gtk/gtkcsscolor.c#L659
 *   (FIXME comment: "Gamut mapping goes here")
 *
 * Browsers per CSS spec DO gamut-map, which clamps out-of-sRGB-gamut values
 * (e.g. negative green from oklab-derived destructive colors). This produces
 * visibly different results for wide-gamut colors like the destructive red.
 *
 * Switching the interpolation space to oklab avoids the issue: oklab values are
 * always in-gamut, so no gamut mapping is triggered, matching GTK's behavior.
 */
const COLOR_MIX_SRGB_RE = /color-mix\(in srgb\b/g;
const fixColorMixGamut: Plugin = {
  postcssPlugin: "gtk-fix-color-mix-gamut",
  Declaration(decl) {
    if (decl.value.includes("color-mix(in srgb")) {
      decl.value = decl.value.replace(COLOR_MIX_SRGB_RE, "color-mix(in oklab");
    }
  },
};

/**
 * The complete GTK → web CSS PostCSS transformation pipeline.
 * Pass a custom asset plugin to replace -gtk-scaled() with embedded data URIs.
 */
export function buildGtkToWeb(assetPlugin?: Plugin) {
  return postcss([
    remapSelectors,
    remapPseudoClasses,
    handleGtkProperties,
    fixGtkTransitionRefs,
    replaceImageFunction,
    fixColorMixGamut,
    removeGtkRecolor,
    assetPlugin ?? removeGtkAssetFunctions,
  ]);
}

/** Default pipeline — removes -gtk-scaled() declarations. */
export const gtkToWeb = buildGtkToWeb();
