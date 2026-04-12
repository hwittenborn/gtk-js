"use client";

import { AdwViewSwitcher } from "@gtk-js/adwaita";
import { useState } from "react";

export default function Example() {
  const [active, setActive] = useState("home");

  return (
    <AdwViewSwitcher
      policy="wide"
      activePageName={active}
      onPageChanged={setActive}
      pages={[
        { name: "home", title: "Home" },
        { name: "search", title: "Search" },
        { name: "settings", title: "Settings" },
      ]}
    />
  );
}
