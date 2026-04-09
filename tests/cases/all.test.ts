import { gtkAssert } from "../assert";
import { gtkTest, gtkTestExpectFailure } from "../harness";

gtkTest("button-circular");
gtkTest("button-disabled");
gtkTest("button-icon");
gtkTest("button-pill");
gtkTest("button-text-default");
gtkTest("button-text-destructive");
gtkTest("button-text-flat");
gtkTest("button-text-suggested");
gtkTest("link-default");
gtkTest("link-visited", (native, web) => {
  gtkAssert.sidesEqual(native.padding, web.padding, "padding");
  gtkAssert.colorsEqual(native.background_color, web.background_color, "background_color");
  gtkAssert.sidesEqual(native.border_widths, web.border_widths, "border_widths");
  gtkAssert.numbersEqual(native.opacity, web.opacity, "opacity");

  // Visited link color is off by ~5/255 due to fixColorMixGamut converting
  // color-mix(in srgb) -> color-mix(in oklab). The srgb->oklab interpolation
  // shift is not user-perceptible (~2%) but exceeds the default 1/255 tolerance.
  gtkAssert.colorsClose(native.color, web.color, {
    tolerance: 6 / 255,
    reason: "fixColorMixGamut converts color-mix from srgb->oklab, shifting visited color ~5/255",
  });
});
gtkTest("menu-button-circular", { childSelector: "button.toggle" });
gtkTest("menu-button-disabled", { childSelector: "button.toggle" });
gtkTest("menu-button-flat", { childSelector: "button.toggle" });
gtkTest("menu-button-icon", { childSelector: "button.toggle" });
gtkTest("menu-button-text-default", { childSelector: "button.toggle" });
gtkTest("toggle-disabled");
gtkTest("toggle-text-checked");
gtkTest("toggle-text-default");
gtkTest("toggle-text-flat");

gtkTestExpectFailure("button-text-default-wrong-bg", ["background_color"]);
gtkTestExpectFailure("button-text-default-wrong-padding", ["padding"]);
gtkTestExpectFailure("button-text-default-wrong-radius", ["border_radius"]);
