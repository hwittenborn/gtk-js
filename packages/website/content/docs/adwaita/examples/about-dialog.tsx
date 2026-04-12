"use client";

import { AdwAboutDialog } from "@gtk-js/adwaita";
import { GtkButton } from "@gtk-js/gtk4";
import { useState } from "react";

export default function Example() {
  const [visible, setVisible] = useState(false);

  return (
    <>
      <GtkButton label="About" onClick={() => setVisible(true)} />
      <AdwAboutDialog
        visible={visible}
        applicationName="My App"
        developerName="Example Developer"
        version="1.0.0"
        comments="A demo application."
        onClosed={() => setVisible(false)}
      />
    </>
  );
}
