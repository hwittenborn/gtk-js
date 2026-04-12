"use client";

import { GtkBox, GtkToggleButton } from "@gtk-js/gtk4";
import { useState } from "react";

export default function Example() {
  const [active, setActive] = useState(false);

  return (
    <GtkBox spacing={8}>
      <GtkToggleButton label="Toggle Me" active={active} onToggled={setActive} />
      <GtkToggleButton label="Flat Toggle" active hasFrame={false} />
    </GtkBox>
  );
}
