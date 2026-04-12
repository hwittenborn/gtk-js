"use client";

import { AdwCarousel, AdwCarouselIndicatorDots } from "@gtk-js/adwaita";
import { GtkLabel } from "@gtk-js/gtk4";
import { useState } from "react";

export default function Example() {
  const [page, setPage] = useState(0);

  return (
    <div style={{ width: 300 }}>
      <AdwCarousel spacing={12} onPageChanged={setPage}>
        <GtkLabel label="Page 1" style={{ padding: 32, textAlign: "center" }} />
        <GtkLabel label="Page 2" style={{ padding: 32, textAlign: "center" }} />
        <GtkLabel label="Page 3" style={{ padding: 32, textAlign: "center" }} />
      </AdwCarousel>
      <AdwCarouselIndicatorDots nPages={3} position={page} />
    </div>
  );
}
