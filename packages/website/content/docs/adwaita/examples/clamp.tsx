"use client";

import { AdwClamp } from "@gtk-js/adwaita";
import { GtkLabel } from "@gtk-js/gtk4";

export default function Example() {
  return (
    <AdwClamp maximumSize={400}>
      <GtkLabel label="This content is clamped to a maximum width of 400px." wrap />
    </AdwClamp>
  );
}
