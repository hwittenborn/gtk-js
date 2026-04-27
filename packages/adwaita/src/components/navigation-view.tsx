import React, {
  createContext,
  forwardRef,
  type HTMLAttributes,
  type ReactNode,
  useCallback,
  useContext,
  useState,
} from "react";

export interface AdwNavigationPageProps {
  tag: string;
  title?: string;
  canPop?: boolean;
  children: ReactNode;
}

export const NavContext = createContext<{
  push: (tag: string) => void;
  pop: () => boolean;
  canPop: boolean;
}>({ push: () => {}, pop: () => false, canPop: false });

export function useNavigation() {
  return useContext(NavContext);
}

export interface AdwNavigationViewProps extends HTMLAttributes<HTMLDivElement> {
  pages: AdwNavigationPageProps[];
  initialPage?: string;
  animateTransitions?: boolean;
  popOnEscape?: boolean;
  onPushed?: (tag: string) => void;
  onPopped?: (tag: string) => void;
}

/**
 * AdwNavigationView — A stack-based navigation container.
 *
 * CSS node: navigation-view
 *
 * @see https://gnome.pages.gitlab.gnome.org/libadwaita/doc/1-latest/class.NavigationView.html
 */
export const AdwNavigationView = forwardRef<HTMLDivElement, AdwNavigationViewProps>(
  function AdwNavigationView(
    {
      pages,
      initialPage,
      animateTransitions = true,
      popOnEscape = true,
      onPushed,
      onPopped,
      className,
      ...rest
    },
    ref,
  ) {
    const [stack, setStack] = useState<string[]>([initialPage ?? pages[0]?.tag ?? ""]);

    const push = useCallback(
      (tag: string) => {
        setStack((s) => [...s, tag]);
        onPushed?.(tag);
      },
      [onPushed],
    );

    const pop = useCallback((): boolean => {
      if (stack.length <= 1) return false;
      const popped = stack[stack.length - 1]!;
      setStack((s) => s.slice(0, -1));
      onPopped?.(popped);
      return true;
    }, [stack, onPopped]);

    const currentTag = stack[stack.length - 1];
    const currentPage = pages.find((p) => p.tag === currentTag);
    const canPop = stack.length > 1 && currentPage?.canPop !== false;

    const handleKeyDown = useCallback(
      (e: React.KeyboardEvent) => {
        if (popOnEscape && e.key === "Escape" && canPop) {
          e.preventDefault();
          pop();
        }
      },
      [popOnEscape, canPop, pop],
    );

    const classes = ["gtk-navigation-view", "gtk-bin-layout"];
    if (className) classes.push(className);

    return (
      <NavContext.Provider value={{ push, pop, canPop }}>
        <div
          ref={ref}
          className={classes.join(" ")}
          onKeyDown={handleKeyDown}
          tabIndex={-1}
          {...rest}
        >
          {currentPage && (
            <div className="gtk-navigation-view-page gtk-bin-layout">{currentPage.children}</div>
          )}
        </div>
      </NavContext.Provider>
    );
  },
);
