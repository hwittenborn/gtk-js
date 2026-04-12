"use client";

import { GtkEntry } from "@gtk-js/gtk4";
import { useState } from "react";

export default function Example() {
  const [text, setText] = useState("");

  return <GtkEntry text={text} placeholderText="Type here..." onChanged={setText} />;
}
