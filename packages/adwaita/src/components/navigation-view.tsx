import React, {
  createContext,
  forwardRef,
  type HTMLAttributes,
  type ReactNode,
  useCallback,
  useContext,
  useLayoutEffect,
  useRef,
  useState,
} from "react";

export interface AdwNavigationPageProps {
  tag: string;
  title?: string;
  canPop?: boolean;
  children: ReactNode;
}

const NavContext = createContext<{
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
  popOnEscape?: boolean;
  onPushed?: (tag: string) => void;
  onPopped?: (tag: string) => void;
}

type TransitionDirection = "push" | "pop";

interface NavigationTransition {
  key: number;
  direction: TransitionDirection;
  enteringTag: string;
  leavingTag: string;
  phase: "starting" | "running";
}

const PAGE_TRANSITION = "transform 200ms ease-out";

/**
 * AdwNavigationView — A stack-based navigation container.
 *
 * CSS node: navigation-view
 *
 * @see https://gnome.pages.gitlab.gnome.org/libadwaita/doc/1-latest/class.NavigationView.html
 */
export const AdwNavigationView = forwardRef<HTMLDivElement, AdwNavigationViewProps>(
  function AdwNavigationView(
    { pages, initialPage, popOnEscape = true, onPushed, onPopped, className, style, ...rest },
    ref,
  ) {
    const [stack, setStack] = useState<string[]>([initialPage ?? pages[0]?.tag ?? ""]);
    const [transition, setTransition] = useState<NavigationTransition | null>(null);
    const previousStackRef = useRef(stack);
    const transitionKeyRef = useRef(0);
    const transitionFrameRef = useRef<number | null>(null);

    const push = useCallback(
      (tag: string) => {
        setStack((s) => [...s, tag]);
        onPushed?.(tag);
      },
      [onPushed],
    );

    const pop = useCallback((): boolean => {
      let popped: string | null = null;

      setStack((s) => {
        if (s.length <= 1) return s;

        const currentTag = s[s.length - 1];
        const currentPage = pages.find((page) => page.tag === currentTag);
        if (currentPage?.canPop === false) return s;

        popped = currentTag ?? null;
        return s.slice(0, -1);
      });

      if (popped) {
        onPopped?.(popped);
        return true;
      }

      return false;
    }, [onPopped, pages]);

    useLayoutEffect(() => {
      const previousStack = previousStackRef.current;
      const previousTag = previousStack[previousStack.length - 1];
      const currentTag = stack[stack.length - 1];

      if (!previousTag || !currentTag || previousTag === currentTag) {
        previousStackRef.current = stack;
        return;
      }

      if (transitionFrameRef.current !== null) {
        cancelAnimationFrame(transitionFrameRef.current);
      }

      const key = transitionKeyRef.current + 1;
      transitionKeyRef.current = key;

      setTransition({
        key,
        direction: stack.length > previousStack.length ? "push" : "pop",
        enteringTag: currentTag,
        leavingTag: previousTag,
        phase: "starting",
      });

      transitionFrameRef.current = requestAnimationFrame(() => {
        setTransition((activeTransition) =>
          activeTransition?.key === key
            ? { ...activeTransition, phase: "running" }
            : activeTransition,
        );
        transitionFrameRef.current = null;
      });

      previousStackRef.current = stack;

      return () => {
        if (transitionFrameRef.current !== null) {
          cancelAnimationFrame(transitionFrameRef.current);
          transitionFrameRef.current = null;
        }
      };
    }, [stack]);

    const findPage = (tag: string | undefined) => pages.find((page) => page.tag === tag);

    const currentTag = stack[stack.length - 1];
    const currentPage = findPage(currentTag);
    const canPop = stack.length > 1 && currentPage?.canPop !== false;
    const leavingPage = transition ? findPage(transition.leavingTag) : null;
    const enteringPage = transition ? findPage(transition.enteringTag) : null;

    const handleTransitionEnd = useCallback(
      (event: React.TransitionEvent<HTMLDivElement>, transitionKey: number) => {
        if (event.target !== event.currentTarget || event.propertyName !== "transform") return;

        setTransition((activeTransition) =>
          activeTransition?.key === transitionKey ? null : activeTransition,
        );
      },
      [],
    );

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

    const renderPage = (
      page: AdwNavigationPageProps,
      pageRole: "single" | "entering" | "leaving",
      activeTransition?: NavigationTransition,
    ) => {
      let transform = "translateX(0)";
      let transitionStyle = "none";
      let zIndex = 0;
      let onTransitionEnd: ((event: React.TransitionEvent<HTMLDivElement>) => void) | undefined;

      if (activeTransition) {
        transitionStyle = activeTransition.phase === "running" ? PAGE_TRANSITION : "none";

        const isPush = activeTransition.direction === "push";
        const isEntering = pageRole === "entering";

        if (activeTransition.phase === "starting") {
          if (isEntering) {
            transform = isPush ? "translateX(100%)" : "translateX(-100%)";
          }
        } else if (isEntering) {
          transform = "translateX(0)";
        } else {
          transform = isPush ? "translateX(-100%)" : "translateX(100%)";
        }

        if (pageRole !== "single") {
          zIndex = isEntering ? 1 : 0;
        }

        if (pageRole !== "single") {
          onTransitionEnd = (event) => handleTransitionEnd(event, activeTransition.key);
        }
      }

      return (
        <div
          key={`${pageRole}:${page.tag}${activeTransition ? `:${activeTransition.key}` : ""}`}
          className="gtk-navigation-view-page gtk-bin-layout"
          aria-hidden={pageRole === "leaving" ? true : undefined}
          onTransitionEnd={onTransitionEnd}
          style={{
            position: "relative",
            overflow: "hidden",
            transform,
            transition: transitionStyle,
            willChange: activeTransition ? "transform" : undefined,
            zIndex,
          }}
        >
          {page.children}
        </div>
      );
    };

    return (
      <NavContext.Provider value={{ push, pop, canPop }}>
        <div
          ref={ref}
          className={classes.join(" ")}
          onKeyDown={handleKeyDown}
          tabIndex={-1}
          style={{
            position: "relative",
            overflow: "hidden",
            ...style,
          }}
          {...rest}
        >
          {transition
            ? [
                leavingPage && renderPage(leavingPage, "leaving", transition),
                enteringPage && renderPage(enteringPage, "entering", transition),
              ]
            : currentPage && renderPage(currentPage, "single")}
        </div>
      </NavContext.Provider>
    );
  },
);
