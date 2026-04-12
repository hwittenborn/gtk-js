"use client";

import { GtkButton, GtkFlowBox, GtkFlowBoxChild } from "@gtk-js/gtk4";

export default function Example() {
  return (
    <GtkFlowBox columnSpacing={8} rowSpacing={8} maxChildrenPerLine={4} style={{ maxWidth: 300 }}>
      {["Red", "Green", "Blue", "Yellow", "Cyan", "Magenta"].map((color) => (
        <GtkFlowBoxChild key={color}>
          <GtkButton label={color} />
        </GtkFlowBoxChild>
      ))}
    </GtkFlowBox>
  );
}
