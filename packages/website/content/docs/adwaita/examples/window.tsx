"use client";

import { AdwHeaderBar, AdwToolbarView, AdwWindow } from "@gtk-js/adwaita";
import { GtkLabel } from "@gtk-js/gtk4";

export default function Example() {
  return (
    <AdwWindow style={{ width: 350, height: 200 }}>
      <AdwToolbarView
        topBars={
          <AdwHeaderBar showBackButton={false} titleWidget={<GtkLabel label="Adwaita App" />} />
        }
        content={<GtkLabel label="Window content" style={{ padding: 24 }} />}
      />
    </AdwWindow>
  );
}
