"use client";

import { GtkHeaderBar, GtkLabel, GtkWindow, GtkWindowTitle } from "@gtk-js/gtk4";

export default function Example() {
  return (
    <GtkWindow
      style={{ width: 350, height: 200 }}
      titlebar={<GtkHeaderBar titleWidget={<GtkWindowTitle title="My App" subtitle="Welcome" />} />}
    >
      <GtkLabel label="Window content" style={{ padding: 24 }} />
    </GtkWindow>
  );
}
