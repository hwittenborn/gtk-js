import { buildIconPackage } from "@gtk-js/icon-helpers/build";

await buildIconPackage(
  new URL("../../upstream/adwaita-icon-theme/Adwaita/symbolic/", import.meta.url).pathname,
  new URL(".", import.meta.url).pathname,
);
