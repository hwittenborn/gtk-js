"use client";

import { GtkBox, GtkButton } from "@gtk-js/gtk4";

export default function Example() {
  return (
    <GtkBox spacing={8} style={{ flexWrap: "wrap", justifyContent: "center" }}>
      <GtkButton label="Default" />
      <GtkButton label="Suggested" className="suggested-action" />
      <GtkButton label="Destructive" className="destructive-action" />
      <GtkButton label="Flat" hasFrame={false} />
      <GtkButton label="Pill" className="pill" />
      <GtkButton label="C" className="circular" />
    </GtkBox>
  );
}
