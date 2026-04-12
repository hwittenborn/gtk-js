"use client";

import { AdwNavigationView } from "@gtk-js/adwaita";
import { GtkBox, GtkButton, GtkLabel } from "@gtk-js/gtk4";

export default function Example() {
  return (
    <AdwNavigationView
      style={{ width: 300, height: 150 }}
      pages={[
        {
          tag: "home",
          title: "Home",
          children: (
            <GtkBox orientation="vertical" spacing={8} style={{ padding: 12 }}>
              <GtkLabel label="Home Page" className="title-2" />
              <GtkButton label="Go to Details" />
            </GtkBox>
          ),
        },
        {
          tag: "details",
          title: "Details",
          children: <GtkLabel label="Details Page" style={{ padding: 12 }} />,
        },
      ]}
    />
  );
}
