import { expect, test } from "bun:test";
import type { Browser } from "playwright";

function debugEnabled(): boolean {
  return Bun.env.GTK_JS_TEST_DEBUG != null;
}

function debugLog(scope: string, message: string): void {
  if (debugEnabled()) {
    console.error(`[${scope}] ${message}`);
  }
}

const GTK_TEST_TIMEOUT = 30_000;

function isPageClosedError(error: unknown): boolean {
  if (!(error instanceof Error)) return false;
  return /Target page, context or browser has been closed/i.test(error.message);
}

export interface WidgetSnapshot {
  width: number;
  height: number;
  padding: Sides;
  border_radius: Corners;
  background_color: Color | null;
  border_widths: Sides;
  border_colors: SideColors;
  color: Color | null;
  font_family: string | null;
  font_weight: number | null;
  shadows: ShadowInfo[];
  inset_shadows: InsetShadowInfo[];
  opacity: number;
}

export interface Sides {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

export interface Corners {
  top_left: number;
  top_right: number;
  bottom_right: number;
  bottom_left: number;
}

export interface Color {
  r: number;
  g: number;
  b: number;
  a: number;
}

interface SideColors {
  top: Color | null;
  right: Color | null;
  bottom: Color | null;
  left: Color | null;
}

interface ShadowInfo {
  color: Color;
  dx: number;
  dy: number;
  radius: number;
}

interface InsetShadowInfo {
  color: Color;
  dx: number;
  dy: number;
  spread: number;
  blur_radius: number;
}

interface CompareResult {
  failures: { property: string; native: unknown; web: unknown }[];
}

const nativeSnapshotCache = new Map<string, Promise<WidgetSnapshot>>();

function parseColor(value: string): Color | null {
  if (value === "transparent" || value === "rgba(0, 0, 0, 0)") {
    return { r: 0, g: 0, b: 0, a: 0 };
  }
  // color(srgb r g b / a) — already 0-1 sRGB floats (may include negatives for wide-gamut)
  const srgb = value.match(
    /color\(srgb\s+([-\d.e+]+)\s+([-\d.e+]+)\s+([-\d.e+]+)(?:\s*\/\s*([-\d.e+]+))?\)/,
  );
  if (srgb) {
    return {
      r: parseFloat(srgb[1]),
      g: parseFloat(srgb[2]),
      b: parseFloat(srgb[3]),
      a: srgb[4] != null ? parseFloat(srgb[4]) : 1.0,
    };
  }
  // oklab(L a b / alpha) — convert to sRGB via OKLab→LMS→linear sRGB→gamma sRGB.
  //
  // IMPORTANT: We replicate GTK's exact apply_gamma(), which does NOT special-case
  // negative linear sRGB values — they fall through to the linear 12.92*v branch.
  // The CSS Color 4 spec (and libraries like culori) instead use sign(v)*gamma(|v|)
  // for negatives. Both are valid extensions of the sRGB transfer function to
  // out-of-gamut values, but they produce different results for wide-gamut colors
  // (e.g. destructive red with negative green). We must match GTK since it's our
  // source of truth.
  //
  // GTK apply_gamma (no negative handling):
  //   https://gitlab.gnome.org/GNOME/gtk/-/blob/5957885ec/gtk/gtkcolorutils.c#L340-346
  // GTK oklab→linear sRGB matrices:
  //   https://gitlab.gnome.org/GNOME/gtk/-/blob/5957885ec/gtk/gtkcolorutils.c#L358-376
  // GTK skips gamut mapping entirely (FIXME in source):
  //   https://gitlab.gnome.org/GNOME/gtk/-/blob/5957885ec/gtk/gtkcsscolor.c#L659
  const oklab = value.match(
    /oklab\(([-\d.e+]+)\s+([-\d.e+]+)\s+([-\d.e+]+)(?:\s*\/\s*([-\d.e+]+))?\)/,
  );
  if (oklab) {
    const L = parseFloat(oklab[1]),
      a = parseFloat(oklab[2]),
      b = parseFloat(oklab[3]);
    const alpha = oklab[4] != null ? parseFloat(oklab[4]) : 1.0;
    const l_ = L + 0.3963377774 * a + 0.2158037573 * b;
    const m_ = L - 0.1055613458 * a - 0.0638541728 * b;
    const s_ = L - 0.0894841775 * a - 1.291485548 * b;
    const l = l_ * l_ * l_,
      m = m_ * m_ * m_,
      s = s_ * s_ * s_;
    const lr = +4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s;
    const lg = -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s;
    const lb = -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s;
    const gamma = (c: number) => (c > 0.0031308 ? 1.055 * Math.pow(c, 1 / 2.4) - 0.055 : 12.92 * c);
    return { r: gamma(lr), g: gamma(lg), b: gamma(lb), a: alpha };
  }
  // rgba(r, g, b, a) or rgb(r, g, b) — 0-255 integers
  const rgba = value.match(/rgba?\(([^)]+)\)/);
  if (rgba) {
    const parts = rgba[1].split(",").map((s) => parseFloat(s.trim()));
    return {
      r: parts[0] / 255,
      g: parts[1] / 255,
      b: parts[2] / 255,
      a: parts.length > 3 ? parts[3] : 1.0,
    };
  }
  return null;
}

export function getNativeSnapshot(caseName: string): Promise<WidgetSnapshot> {
  const cached = nativeSnapshotCache.get(caseName);
  if (cached) return cached;

  const promise = (async () => {
    debugLog("native", `fetch start case=${caseName} port=${globalThis.__nativeServerPort}`);
    const response = await fetch(
      `http://127.0.0.1:${globalThis.__nativeServerPort}/${encodeURIComponent(caseName)}`,
    );

    if (!response.ok) {
      const body = await response.text();
      throw new Error(`Native snapshot failed for ${caseName} (HTTP ${response.status}):\n${body}`);
    }

    debugLog("native", `fetch complete case=${caseName}`);
    return (await response.json()) as WidgetSnapshot;
  })();

  nativeSnapshotCache.set(caseName, promise);
  return promise;
}

export async function extractWebStyles(
  browser: Browser,
  caseName: string,
  childSelector?: string,
): Promise<WidgetSnapshot> {
  const browserName = browser.browserType().name();
  const page = globalThis.__testPages[browserName];
  const rootSelector = `[data-case="${caseName}"] [data-testid='target']`;
  const selector = childSelector ? `${rootSelector} ${childSelector}` : rootSelector;

  try {
    debugLog("web", `read case=${caseName} browser=${browserName}`);
    await page.locator(rootSelector).waitFor();
    debugLog("web", `selector ready case=${caseName} browser=${browserName}`);
    const raw = await page.locator(selector).evaluate((el: HTMLElement) => {
      const cs = getComputedStyle(el);
      const rect = el.getBoundingClientRect();
      return {
        width: rect.width,
        height: rect.height,
        padding: {
          top: parseFloat(cs.paddingTop),
          right: parseFloat(cs.paddingRight),
          bottom: parseFloat(cs.paddingBottom),
          left: parseFloat(cs.paddingLeft),
        },
        border_radius: {
          top_left: parseFloat(cs.borderTopLeftRadius),
          top_right: parseFloat(cs.borderTopRightRadius),
          bottom_right: parseFloat(cs.borderBottomRightRadius),
          bottom_left: parseFloat(cs.borderBottomLeftRadius),
        },
        background_color: cs.backgroundColor,
        border_widths: {
          top: parseFloat(cs.borderTopWidth),
          right: parseFloat(cs.borderRightWidth),
          bottom: parseFloat(cs.borderBottomWidth),
          left: parseFloat(cs.borderLeftWidth),
        },
        border_colors: {
          top: cs.borderTopColor,
          right: cs.borderRightColor,
          bottom: cs.borderBottomColor,
          left: cs.borderLeftColor,
        },
        color: cs.color,
        font_family: cs.fontFamily.replace(/['"]/g, "").split(",")[0].trim(),
        font_weight: parseInt(cs.fontWeight),
        shadows: [] as string[],
        inset_shadows: [] as string[],
        opacity: parseFloat(cs.opacity),
      };
    });

    return {
      width: raw.width,
      height: raw.height,
      padding: raw.padding,
      border_radius: raw.border_radius,
      background_color: parseColor(raw.background_color),
      border_widths: raw.border_widths,
      border_colors: {
        top: parseColor(raw.border_colors.top),
        right: parseColor(raw.border_colors.right),
        bottom: parseColor(raw.border_colors.bottom),
        left: parseColor(raw.border_colors.left),
      },
      color: parseColor(raw.color),
      font_family: raw.font_family,
      font_weight: raw.font_weight,
      shadows: [],
      inset_shadows: [],
      opacity: raw.opacity,
    };
  } catch (error) {
    if (isPageClosedError(error)) {
      throw error;
    }
    throw error;
  }
}

export const DEFAULT_COLOR_TOLERANCE = 1 / 255;
export const DEFAULT_NUMBER_TOLERANCE = 0.5;

export function normalizeTransparent(c: Color | null): Color | null {
  if (c !== null && c.a === 0) return null;
  return c;
}

function colorsMatch(
  a: Color | null,
  b: Color | null,
  tolerance = DEFAULT_COLOR_TOLERANCE,
): boolean {
  if (a === null && b === null) return true;
  if (a === null || b === null) return false;
  return (
    Math.abs(a.r - b.r) <= tolerance &&
    Math.abs(a.g - b.g) <= tolerance &&
    Math.abs(a.b - b.b) <= tolerance &&
    Math.abs(a.a - b.a) <= tolerance
  );
}

function numbersMatch(a: number, b: number, tolerance = DEFAULT_NUMBER_TOLERANCE): boolean {
  return Math.abs(a - b) <= tolerance;
}

function checkSides(
  prefix: string,
  native: Sides,
  web: Sides,
  check: (property: string, n: number, w: number) => void,
) {
  for (const side of ["top", "right", "bottom", "left"] as const) {
    check(`${prefix}.${side}`, native[side], web[side]);
  }
}

export function compare(native: WidgetSnapshot, web: WidgetSnapshot): CompareResult {
  const failures: CompareResult["failures"] = [];

  function checkNumber(property: string, n: number, w: number) {
    if (!numbersMatch(n, w)) {
      failures.push({ property, native: n, web: w });
    }
  }

  function checkColor(property: string, n: Color | null, w: Color | null) {
    if (!colorsMatch(n, w)) {
      failures.push({ property, native: n, web: w });
    }
  }

  checkSides("padding", native.padding, web.padding, checkNumber);

  // GTK clamps border-radius to min(width,height)/2 at paint time,
  // but browsers keep the literal CSS value (e.g. 9999px from Adwaita SCSS).
  const halfMin = Math.min(native.width, native.height) / 2;
  function checkRadius(property: string, n: number, w: number) {
    const clamp = (r: number) => Math.min(r, halfMin);
    if (!numbersMatch(clamp(n), clamp(w))) {
      failures.push({ property, native: n, web: w });
    }
  }
  // Skip border_radius when native background is transparent — GTK only emits a
  // RoundedClipNode when there's visible content to clip. No public API exists to
  // read computed border-radius outside render nodes.
  const nativeBgVisible = native.background_color !== null && native.background_color.a > 0;
  if (nativeBgVisible) {
    for (const corner of ["top_left", "top_right", "bottom_right", "bottom_left"] as const) {
      checkRadius(
        `border_radius.${corner}`,
        native.border_radius[corner],
        web.border_radius[corner],
      );
    }
  }

  checkColor(
    "background_color",
    normalizeTransparent(native.background_color),
    normalizeTransparent(web.background_color),
  );

  checkSides("border_widths", native.border_widths, web.border_widths, checkNumber);

  checkColor("color", native.color, web.color);

  // Cantarell was renamed to Adwaita Sans in GTK 47+
  function normalizeFontFamily(f: string) {
    return f.toLowerCase().replace("adwaita sans", "cantarell");
  }
  if (native.font_family && web.font_family) {
    if (normalizeFontFamily(native.font_family) !== normalizeFontFamily(web.font_family)) {
      failures.push({ property: "font_family", native: native.font_family, web: web.font_family });
    }
  }

  if (native.font_weight != null && web.font_weight != null) {
    checkNumber("font_weight", native.font_weight, web.font_weight);
  }

  checkNumber("opacity", native.opacity, web.opacity);

  return { failures };
}

export type GtkTestCallback = (native: WidgetSnapshot, web: WidgetSnapshot) => void;

export interface GtkTestOptions {
  /** CSS selector for a child element within [data-testid='target'] to extract styles from.
   *  Use for container widgets where the visual element is a child (e.g. GtkMenuButton's inner toggle button). */
  childSelector?: string;
}

export function gtkTest(
  caseName: string,
  cbOrOpts?: GtkTestCallback | GtkTestOptions,
  cb?: GtkTestCallback,
) {
  const opts: GtkTestOptions = typeof cbOrOpts === "function" ? {} : (cbOrOpts ?? {});
  const callback = typeof cbOrOpts === "function" ? cbOrOpts : cb;
  const browsers = globalThis.__testBrowsers;
  for (const [browserName, browser] of Object.entries(browsers)) {
    test.concurrent(
      `${caseName} (${browserName})`,
      async () => {
        debugLog("test", `start case=${caseName} browser=${browserName}`);
        const [native, web] = await Promise.all([
          getNativeSnapshot(caseName),
          extractWebStyles(browser, caseName, opts?.childSelector),
        ]);
        try {
          if (callback) {
            callback(native, web);
          } else {
            const result = compare(native, web);
            if (result.failures.length > 0) {
              console.error("Failures:", JSON.stringify(result.failures, null, 2));
            }
            expect(result.failures).toEqual([]);
          }
        } catch (err) {
          console.error("Native:", JSON.stringify(native, null, 2));
          console.error("Web:", JSON.stringify(web, null, 2));
          throw err;
        } finally {
          debugLog("test", `end case=${caseName} browser=${browserName}`);
        }
      },
      GTK_TEST_TIMEOUT,
    );
  }
}

export function gtkTestExpectFailure(caseName: string, expectedFailProperties: string[]) {
  const browsers = globalThis.__testBrowsers;
  for (const [browserName, browser] of Object.entries(browsers)) {
    test.concurrent(
      `${caseName} (${browserName}) [expected failure]`,
      async () => {
        debugLog("test", `start case=${caseName} browser=${browserName} expected-failure`);
        const nativeCaseName = caseName.replace(/-wrong-.*$/, "");
        const [native, web] = await Promise.all([
          getNativeSnapshot(nativeCaseName),
          extractWebStyles(browser, caseName),
        ]);
        const result = compare(native, web);
        expect(result.failures.length).toBeGreaterThan(0);
        for (const prop of expectedFailProperties) {
          expect(result.failures.some((f) => f.property.startsWith(prop))).toBe(true);
        }
        debugLog("test", `end case=${caseName} browser=${browserName} expected-failure`);
      },
      GTK_TEST_TIMEOUT,
    );
  }
}
