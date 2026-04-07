import { GtkTheme } from "@gtk-js/gtk-css";
import light from "../dist/light_default.css" with { type: "text" };
import dark from "../dist/dark_default.css" with { type: "text" };

function resolveScheme(scheme: "light" | "dark" | "auto"): "light" | "dark" {
  if (scheme !== "auto") return scheme;
  if (typeof window !== "undefined" && window.matchMedia?.("(prefers-color-scheme: dark)").matches) {
    return "dark";
  }
  return "light";
}

export class WhiteSurTheme extends GtkTheme {
  readonly colorScheme: "light" | "dark" | "auto";

  constructor({
    colorScheme = "light",
  }: {
    colorScheme?: "light" | "dark" | "auto";
  } = {}) {
    super();
    this.colorScheme = colorScheme;
  }

  getCSS() {
    return resolveScheme(this.colorScheme) === "dark" ? dark : light;
  }
}
