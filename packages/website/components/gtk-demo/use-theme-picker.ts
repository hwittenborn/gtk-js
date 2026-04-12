"use client";

import type { GtkTheme, IconMap } from "@gtk-js/gtk4";
import * as adwaitaIcons from "@gtk-js/icons-adwaita";
import * as fluentIcons from "@gtk-js/icons-fluent";
import * as mactahoeIcons from "@gtk-js/icons-mactahoe";
import * as whitesurIcons from "@gtk-js/icons-whitesur";
import { AdwaitaTheme } from "@gtk-js/theme-adwaita";
import { FluentTheme } from "@gtk-js/theme-fluent";
import { MacTahoeTheme } from "@gtk-js/theme-mactahoe";
import { WhiteSurTheme } from "@gtk-js/theme-whitesur";
import { useMemo, useState } from "react";

export type ThemeName = "adwaita" | "whitesur" | "mactahoe" | "fluent";

export const THEME_LABELS: Record<ThemeName, string> = {
  adwaita: "Adwaita",
  whitesur: "Big Sur",
  mactahoe: "Tahoe",
  fluent: "Fluent",
};

export const ADWAITA_ACCENT_PRESETS = [
  "#3584e4",
  "#9141ac",
  "#e66100",
  "#2ec27e",
  "#e01b24",
  "#f5c211",
];

export const FLUENT_ACCENT_PRESETS = [
  "#1A73E8",
  "#9C27B0",
  "#E91E63",
  "#F44336",
  "#FF9800",
  "#FFEB3B",
  "#4CAF50",
  "#009688",
  "#9E9E9E",
];

const THEME_ICONS: Record<ThemeName, IconMap> = {
  adwaita: adwaitaIcons,
  whitesur: whitesurIcons,
  mactahoe: mactahoeIcons,
  fluent: fluentIcons,
};

export interface ThemePickerState {
  theme: GtkTheme;
  icons: IconMap;
  themeName: ThemeName;
  setThemeName: (t: ThemeName) => void;
  colorScheme: "light" | "dark" | "auto";
  setColorScheme: (s: "light" | "dark" | "auto") => void;
  adwaitaAccent: string;
  setAdwaitaAccent: (c: string) => void;
  fluentAccent: string;
  setFluentAccent: (c: string) => void;
  fluentTitlebutton: "circular" | "square";
  setFluentTitlebutton: (t: "circular" | "square") => void;
  fluentWindow: "default" | "round";
  setFluentWindow: (w: "default" | "round") => void;
}

export function useThemePicker(): ThemePickerState {
  const [themeName, setThemeName] = useState<ThemeName>("adwaita");
  const [colorScheme, setColorScheme] = useState<"light" | "dark" | "auto">("auto");
  const [adwaitaAccent, setAdwaitaAccent] = useState("#3584e4");
  const [fluentAccent, setFluentAccent] = useState("#1A73E8");
  const [fluentTitlebutton, setFluentTitlebutton] = useState<"circular" | "square">("square");
  const [fluentWindow, setFluentWindow] = useState<"default" | "round">("default");

  const theme = useMemo((): GtkTheme => {
    if (themeName === "adwaita")
      return new AdwaitaTheme({ colorScheme, accentColor: adwaitaAccent });
    if (themeName === "whitesur") return new WhiteSurTheme({ colorScheme });
    if (themeName === "mactahoe") return new MacTahoeTheme({ colorScheme });
    if (themeName === "fluent") {
      return new FluentTheme({
        colorScheme,
        titlebutton: fluentTitlebutton,
        window: fluentWindow,
        accentColor: fluentAccent,
      });
    }
    throw new Error(`Unknown theme: ${themeName satisfies never}`);
  }, [themeName, colorScheme, adwaitaAccent, fluentAccent, fluentTitlebutton, fluentWindow]);

  return {
    theme,
    icons: THEME_ICONS[themeName],
    themeName,
    setThemeName,
    colorScheme,
    setColorScheme,
    adwaitaAccent,
    setAdwaitaAccent,
    fluentAccent,
    setFluentAccent,
    fluentTitlebutton,
    setFluentTitlebutton,
    fluentWindow,
    setFluentWindow,
  };
}
