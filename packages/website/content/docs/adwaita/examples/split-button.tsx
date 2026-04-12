"use client";

import { AdwSplitButton } from "@gtk-js/adwaita";
import { GtkLabel } from "@gtk-js/gtk4";

export default function Example() {
  return (
    <AdwSplitButton label="Save" popover={<GtkLabel label="Save As..." style={{ padding: 8 }} />} />
  );
}
