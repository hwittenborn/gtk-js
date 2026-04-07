import { GtkProvider, type GtkProviderProps } from "@gtk-js/gtk4";
import { AdwaitaTheme } from "@gtk-js/theme-adwaita";
import { type ReactNode, useMemo } from "react";

export interface AdwaitaProviderProps
  extends Omit<GtkProviderProps, "theme" | "cssHref" | "cssText"> {
  /** Color scheme. Default: "auto" (follows prefers-color-scheme). */
  colorScheme?: "light" | "dark" | "auto";
  /** Accent color (hex). Defaults to GNOME blue via AdwaitaTheme. */
  accentColor?: string;
  children: ReactNode;
}

/**
 * AdwaitaProvider — Initializes the Adwaita theme, analogous to adw_init().
 *
 * Replaces GtkProvider — use one or the other, not both.
 * Constructs an AdwaitaTheme instance from props and passes it to GtkProvider.
 */
export function AdwaitaProvider({
  colorScheme = "auto",
  accentColor,
  ...rest
}: AdwaitaProviderProps) {
  const theme = useMemo(
    () => new AdwaitaTheme({ colorScheme, accentColor }),
    [colorScheme, accentColor],
  );
  return <GtkProvider theme={theme} {...rest} />;
}
