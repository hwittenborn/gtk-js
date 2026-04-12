"use client";

import { GtkBox, GtkLabel } from "@gtk-js/gtk4";

export default function Example() {
  return (
    <GtkBox orientation="vertical" spacing={4}>
      <GtkLabel label="Title" className="title-1" />
      <GtkLabel label="This is body text in a GtkLabel." />
      <GtkLabel label="Dimmed caption" className="dim-label caption" />
    </GtkBox>
  );
}
