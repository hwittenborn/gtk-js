"use client";

import { GtkButton, GtkHeaderBar, GtkLabel } from "@gtk-js/gtk4";

export default function Example() {
  return (
    <GtkHeaderBar
      titleWidget={<GtkLabel label="My Application" />}
      start={<GtkButton iconName="OpenMenu" hasFrame={false} />}
    />
  );
}
