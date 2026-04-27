import { forwardRef, type HTMLAttributes, type ReactNode, useMemo } from "react";
import { alignAttrs, type GtkAlignProps } from "../types.ts";
import { type WindowControlsAPI, WindowControlsContext } from "../window-controls-context.tsx";

export interface GtkWindowProps extends HTMLAttributes<HTMLDivElement>, GtkAlignProps {
  /** The titlebar widget (typically a GtkHeaderBar). */
  titlebar?: ReactNode;
  /** Main content of the window. */
  children?: ReactNode;
  /**
   * Whether the window is maximized.
   * Adds the .maximized CSS class, which removes border-radius and shadows
   * to match GTK's window manager behavior.
   * @see upstream/gtk/gtk/gtkwindow.c — add_or_remove_class(widget, priv->maximized, "maximized")
   */
  maximized?: boolean;
  /** Called when the close button is clicked. */
  onClose?: () => void;
  /** Called when the minimize button is clicked. */
  onMinimize?: () => void;
  /** Called when the maximize button is clicked. */
  onMaximize?: () => void;
  /** Called when the titlebar is dragged (for window move). */
  onDrag?: () => void;
}

/**
 * GtkWindow — A top-level window.
 *
 * CSS node: window.background.csd
 *
 * In native GTK, the window manager controls sizing. On the web, the
 * window takes the size of its content by default — the user controls
 * sizing via style/className props.
 *
 * Window control callbacks (onClose, onMinimize, onMaximize, onDrag) are
 * provided to descendant header bars via WindowControlsContext, matching
 * native GTK's action-based pattern where the window owns the operations.
 *
 * @see https://docs.gtk.org/gtk4/class.Window.html
 */
export const GtkWindow = forwardRef<HTMLDivElement, GtkWindowProps>(function GtkWindow(
  {
    titlebar,
    children,
    halign,
    valign,
    className,
    style,
    maximized,
    onClose,
    onMinimize,
    onMaximize,
    onDrag,
    ...rest
  },
  ref,
) {
  const classes = ["gtk-window", "background", "csd"];
  if (maximized) classes.push("maximized");
  if (className) classes.push(className);

  const windowControls = useMemo<WindowControlsAPI>(
    () => ({ close: onClose, minimize: onMinimize, maximize: onMaximize, drag: onDrag }),
    [onClose, onMinimize, onMaximize, onDrag],
  );

  return (
    <WindowControlsContext.Provider value={windowControls}>
      <div
        ref={ref}
        className={classes.join(" ")}
        {...alignAttrs(halign, valign)}
        style={style}
        {...rest}
      >
        {titlebar && <div className="titlebar">{titlebar}</div>}
        <div className="gtk-box gtk-box-layout vertical" style={{ flex: 1, minHeight: 0 }}>
          {children}
        </div>
      </div>
    </WindowControlsContext.Provider>
  );
});
