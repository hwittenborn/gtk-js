"use client";

import { AdwDialog } from "@gtk-js/adwaita";
import { GtkButton, GtkLabel } from "@gtk-js/gtk4";
import { useState } from "react";

export default function Example() {
  const [visible, setVisible] = useState(false);

  return (
    <>
      <GtkButton label="Open Dialog" onClick={() => setVisible(true)} />
      <AdwDialog visible={visible} contentWidth={300} onClosed={() => setVisible(false)}>
        <GtkLabel label="Dialog content" style={{ padding: 24 }} />
      </AdwDialog>
    </>
  );
}
