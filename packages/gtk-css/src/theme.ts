/**
 * Abstract base class for GTK themes.
 *
 * Subclasses own all state (color scheme, accent, variants, etc.)
 * and return the full CSS string via getCSS().
 *
 * Third parties can subclass this with zero dependency on React or widgets.
 */
export abstract class GtkTheme {
  abstract getCSS(): string;
}

/** Resolve "auto" color scheme to "light" or "dark" using prefers-color-scheme. */
export function resolveColorScheme(scheme: "light" | "dark" | "auto"): "light" | "dark" {
  if (scheme !== "auto") return scheme;
  if (
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-color-scheme: dark)").matches
  ) {
    return "dark";
  }
  return "light";
}
