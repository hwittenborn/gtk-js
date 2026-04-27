import { createContext, useContext } from "react";

export interface WindowControlsAPI {
  close?: () => void;
  minimize?: () => void;
  maximize?: () => void;
  drag?: () => void;
}

export const WindowControlsContext = createContext<WindowControlsAPI | undefined>(undefined);

export function useWindowControls(): WindowControlsAPI | undefined {
  return useContext(WindowControlsContext);
}
