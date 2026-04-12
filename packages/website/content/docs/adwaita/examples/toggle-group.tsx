"use client";

import { AdwToggleGroup } from "@gtk-js/adwaita";
import { useState } from "react";

export default function Example() {
  const [active, setActive] = useState(0);

  return (
    <AdwToggleGroup
      active={active}
      toggles={[
        { name: "list", label: "List" },
        { name: "grid", label: "Grid" },
        { name: "compact", label: "Compact" },
      ]}
      onToggleChanged={(i) => setActive(i)}
    />
  );
}
