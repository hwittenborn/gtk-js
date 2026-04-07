import { compileGtkCSS } from "@gtk-js/gtk-css/compile";

const css = await compileGtkCSS(
  new URL("../../upstream/libadwaita/src/stylesheet/default.scss", import.meta.url).pathname,
);

await Bun.write(new URL("dist/adwaita.css", import.meta.url).pathname, css);
console.log(`Built adwaita.css (${css.length} bytes)`);
