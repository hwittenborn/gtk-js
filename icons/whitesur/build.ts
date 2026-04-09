import { buildIconPackage } from "@gtk-js/icon-helpers/build";

await buildIconPackage(
  new URL("../../upstream/whitesur-icon-theme/src/", import.meta.url).pathname,
  new URL(".", import.meta.url).pathname,
);
