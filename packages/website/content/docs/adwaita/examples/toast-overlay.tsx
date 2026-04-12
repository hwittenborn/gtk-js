"use client";

import { AdwToastOverlay, type AdwToastOverlayRef } from "@gtk-js/adwaita";
import { GtkButton } from "@gtk-js/gtk4";
import { useRef } from "react";

export default function Example() {
  const toastRef = useRef<AdwToastOverlayRef>(null);

  return (
    <AdwToastOverlay toastRef={toastRef} style={{ minHeight: 100 }}>
      <GtkButton
        label="Show Toast"
        onClick={() => toastRef.current?.addToast({ title: "Hello!" })}
      />
    </AdwToastOverlay>
  );
}
