import { buildIconPackage } from "@gtk-js/icon-helpers/build";

await buildIconPackage(
  new URL("../../upstream/fluent-icon-theme/src/symbolic/", import.meta.url).pathname,
  new URL(".", import.meta.url).pathname,
);
