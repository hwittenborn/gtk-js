"use client";

import { AdwButtonRow, AdwPreferencesGroup } from "@gtk-js/adwaita";

export default function Example() {
  return (
    <AdwPreferencesGroup style={{ width: 360 }}>
      <AdwButtonRow title="Reset Settings" className="destructive-action" />
    </AdwPreferencesGroup>
  );
}
