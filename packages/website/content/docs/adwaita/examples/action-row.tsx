"use client";

import { AdwActionRow, AdwPreferencesGroup } from "@gtk-js/adwaita";

export default function Example() {
  return (
    <AdwPreferencesGroup title="Account" style={{ width: 360 }}>
      <AdwActionRow title="Username" subtitle="john_doe" />
      <AdwActionRow title="Email" subtitle="john@example.com" />
    </AdwPreferencesGroup>
  );
}
