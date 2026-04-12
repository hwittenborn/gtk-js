"use client";

import { AdwHeaderBar } from "@gtk-js/adwaita";
import { GtkLabel } from "@gtk-js/gtk4";

export default function Example() {
  return <AdwHeaderBar titleWidget={<GtkLabel label="My App" />} showBackButton={false} />;
}
