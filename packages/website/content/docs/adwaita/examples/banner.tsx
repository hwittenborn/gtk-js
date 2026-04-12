"use client";

import { AdwBanner } from "@gtk-js/adwaita";

export default function Example() {
  return (
    <AdwBanner revealed title="You are offline" buttonLabel="Retry" onButtonClicked={() => {}} />
  );
}
