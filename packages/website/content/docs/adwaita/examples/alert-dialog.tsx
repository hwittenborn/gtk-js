"use client";

import { AdwAlertDialog } from "@gtk-js/adwaita";
import { GtkButton } from "@gtk-js/gtk4";
import { useState } from "react";

export default function Example() {
  const [visible, setVisible] = useState(false);

  return (
    <>
      <GtkButton label="Show Alert" onClick={() => setVisible(true)} />
      <AdwAlertDialog
        visible={visible}
        heading="Delete File?"
        body="This action cannot be undone."
        responses={[
          { id: "cancel", label: "Cancel" },
          { id: "delete", label: "Delete", appearance: "destructive" },
        ]}
        onResponse={() => setVisible(false)}
      />
    </>
  );
}
