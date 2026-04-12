import { gtkTest } from "../harness";

// The outer `dropdown` div is a plain container; the styled element is the
// inner button.toggle — same pattern as GtkMenuButton.
gtkTest("dropdown-default", { childSelector: "button.toggle" });
