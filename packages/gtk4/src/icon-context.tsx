import type { GtkIcon } from "@gtk-js/icon-helpers";
import { createContext, useContext } from "react";

/**
 * Map of icon names to icon components.
 * Both @gtk-js/icons-gtk4 and @gtk-js/icons-adwaita export compatible maps.
 */
export type IconMap = Record<string, GtkIcon>;

const IconContext = createContext<IconMap>({});

export const IconProvider = IconContext.Provider;

/**
 * Retrieve an icon component by PascalCase name from the current provider's icon set.
 * Returns undefined if the icon isn't found.
 */
export function useIcon(name: string): GtkIcon | undefined {
  const icons = useContext(IconContext);
  return icons[name];
}

/**
 * Retrieve the full icon map from context.
 */
export function useIcons(): IconMap {
  return useContext(IconContext);
}
