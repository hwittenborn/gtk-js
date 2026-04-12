import { gtkAssert } from "../assert";
import { gtkTest } from "../harness";

gtkTest("notebook-default", (native, web) => {
  // background_color: WidgetPaintable captures the adw::Window's white
  // background as the notebook's own color (the notebook itself has no explicit
  // CSS background). The web notebook div is transparent. Skip this property.
  gtkAssert.sidesEqual(native.padding, web.padding, "padding");
  gtkAssert.sidesEqual(native.border_widths, web.border_widths, "border_widths");
  gtkAssert.numbersEqual(native.opacity, web.opacity, "opacity");
  gtkAssert.colorsEqual(native.color, web.color, "color");
});
