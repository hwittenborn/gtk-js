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
