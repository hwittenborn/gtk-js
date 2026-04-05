import {
  type CSSProperties,
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useInsertionEffect,
} from "react";
import { type IconMap, IconProvider } from "./icon-context.tsx";
import layoutCSS from "./layouts/layout.css" with { type: "text" };
import resetCSS from "./reset.css" with { type: "text" };

export interface GtkProviderProps {
  /** Accent color (hex). Applied as --accent-bg-color. */
  accentColor?: string;
  /** Color scheme preference. Default: "auto" (follows prefers-color-scheme). */
  colorScheme?: "light" | "dark" | "auto";
  /** Enable high contrast mode. Default: false. */
  highContrast?: boolean;
  /** URL to a theme CSS file (loaded via <link> tag). */
  cssHref?: string;
  /** Theme CSS as a string (injected via <style> tag). Takes priority over cssHref. */
  cssText?: string;
  /** Icon set to use. Pass the full export of an icon package (e.g. @gtk-js/gtk4-icons). */
  icons?: IconMap;
  /** Style applied to the root scoping div. */
  style?: CSSProperties;
  children: ReactNode;
}

interface GtkThemeContext {
  accentColor?: string;
  colorScheme: "light" | "dark" | "auto";
  highContrast: boolean;
}

const ThemeContext = createContext<GtkThemeContext>({
  colorScheme: "auto",
  highContrast: false,
});

export function useGtkTheme() {
  return useContext(ThemeContext);
}

/**
 * GtkProvider — Initializes the GTK theme, analogous to gtk_init().
 *
 * Injects the reset stylesheet and theme stylesheet, and provides theme
 * context (accent color, color scheme, high contrast) and icon set
 * to descendants.
 *
 * Everything inside this provider gets browser defaults stripped and GTK
 * theme applied. Everything outside is completely unaffected.
 */
export function GtkProvider({
  accentColor,
  colorScheme = "auto",
  highContrast = false,
  cssHref,
  cssText,
  icons = {},
  style,
  children,
}: GtkProviderProps) {
  // Inject reset + layout CSS
  useInsertionEffect(() => {
    const id = "gtk-js-reset";
    if (document.getElementById(id)) return;

    const style = document.createElement("style");
    style.id = id;
    style.textContent = resetCSS + "\n" + layoutCSS;
    document.head.appendChild(style);

    return () => {
      style.remove();
    };
  }, []);

  // Inject theme CSS inline (takes priority over cssHref)
  useInsertionEffect(() => {
    if (!cssText) return;

    const id = "gtk-js-theme";
    if (document.getElementById(id)) return;

    const style = document.createElement("style");
    style.id = id;
    style.textContent = cssText;
    document.head.appendChild(style);

    return () => {
      style.remove();
    };
  }, [cssText]);

  // Inject theme stylesheet via <link> (fallback when cssText not provided)
  useInsertionEffect(() => {
    if (cssText || !cssHref) return;

    const id = "gtk-js-theme";
    if (document.getElementById(id)) return;

    const link = document.createElement("link");
    link.id = id;
    link.rel = "stylesheet";
    link.href = cssHref;
    document.head.appendChild(link);

    return () => {
      link.remove();
    };
  }, [cssText, cssHref]);

  // Apply accent color as CSS custom properties
  useEffect(() => {
    if (!accentColor) return;

    const style = document.createElement("style");
    style.id = "gtk-js-accent";
    style.textContent = `:root { --accent-bg-color: ${accentColor}; }`;
    document.head.appendChild(style);

    return () => {
      style.remove();
    };
  }, [accentColor]);

  return (
    <ThemeContext.Provider value={{ accentColor, colorScheme, highContrast }}>
      <IconProvider value={icons}>
        <div
          data-gtk-provider=""
          className="background"
          style={style}
          {...(colorScheme !== "auto" ? { "data-color-scheme": colorScheme } : {})}
        >
          {children}
        </div>
      </IconProvider>
    </ThemeContext.Provider>
  );
}
