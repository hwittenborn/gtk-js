"use client";

import { AdwPreferencesGroup, AdwPreferencesRow } from "@gtk-js/adwaita";

export default function Example() {
  return (
    <AdwPreferencesGroup style={{ width: 360 }}>
      <AdwPreferencesRow title="A simple row" />
    </AdwPreferencesGroup>
  );
}
