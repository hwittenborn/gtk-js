"use client";

import { AdwOverlaySplitView } from "@gtk-js/adwaita";
import { GtkLabel } from "@gtk-js/gtk4";

export default function Example() {
  return (
    <AdwOverlaySplitView
      style={{ height: 200 }}
      sidebar={<GtkLabel label="Sidebar" style={{ padding: 12 }} />}
      content={<GtkLabel label="Main Content" style={{ padding: 12 }} />}
    />
  );
}
