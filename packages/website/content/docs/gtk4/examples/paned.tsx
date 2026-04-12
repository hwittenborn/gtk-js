"use client";

import { GtkLabel, GtkPaned } from "@gtk-js/gtk4";

export default function Example() {
  return (
    <GtkPaned
      position={150}
      wideHandle
      style={{ height: 120 }}
      startChild={<GtkLabel label="Start" style={{ padding: 12 }} />}
      endChild={<GtkLabel label="End" style={{ padding: 12 }} />}
    />
  );
}
