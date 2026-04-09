import { buildIconPackage } from "@gtk-js/icon-helpers/build";

await buildIconPackage(
  new URL("../../upstream/gtk/gtk/icons/", import.meta.url).pathname,
  new URL(".", import.meta.url).pathname,
);
