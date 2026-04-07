import { GtkTheme, resolveColorScheme } from "@gtk-js/gtk-css";
import dark from "../dist/dark_default.css" with { type: "text" };
import light from "../dist/light_default.css" with { type: "text" };

export class MacTahoeTheme extends GtkTheme {
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
    return resolveColorScheme(this.colorScheme) === "dark" ? dark : light;
  }
}
