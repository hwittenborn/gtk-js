"use client";

import { GtkBox, GtkCheckButton } from "@gtk-js/gtk4";
import { useState } from "react";

export default function Example() {
  const [checked, setChecked] = useState(false);

  return (
    <GtkBox spacing={16}>
      <GtkCheckButton label="Accept terms" active={checked} onToggled={setChecked} />
      <GtkCheckButton label="Option A" group="demo" active />
      <GtkCheckButton label="Option B" group="demo" />
    </GtkBox>
  );
}
