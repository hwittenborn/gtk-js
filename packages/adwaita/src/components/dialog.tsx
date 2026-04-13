import React, {
  forwardRef,
  type HTMLAttributes,
  type ReactNode,
  useCallback,
  useEffect,
} from "react";
import { createPortal } from "react-dom";
import type { AdwDialogPresentationMode } from "../types.ts";

export interface AdwDialogProps extends HTMLAttributes<HTMLDivElement> {
  title?: string;
  child?: ReactNode;
  visible?: boolean;
  canClose?: boolean;
  presentationMode?: AdwDialogPresentationMode;
  contentWidth?: number;
  contentHeight?: number;
  followsContentSize?: boolean;
  portal?: boolean | HTMLElement;
  onClosed?: () => void;
  onCloseAttempt?: () => void;
}

/**
 * AdwDialog — An adaptive dialog (floating on desktop, bottom-sheet on mobile).
 *
 * Upstream CSS node name: "dialog" (mapped to .gtk-dialog)
 * Layout manager: GTK_TYPE_BIN_LAYOUT
 *
 * Native structure (floating mode):
 *   dialog-host > dialog.background[.floating] > floating-sheet > dimming
 *                                                                > sheet > child
 *
 * @see https://gnome.pages.gitlab.gnome.org/libadwaita/doc/1-latest/class.Dialog.html
 */
export const AdwDialog = forwardRef<HTMLDivElement, AdwDialogProps>(function AdwDialog(
  {
    title,
    child,
    visible = false,
    canClose = true,
    presentationMode = "auto",
    contentWidth = -1,
    contentHeight = -1,
    followsContentSize = false,
    portal = false,
    onClosed,
    onCloseAttempt,
    className,
    style,
    children,
    ...rest
  },
  ref,
) {
  const close = useCallback(() => {
    if (!canClose) {
      onCloseAttempt?.();
      return;
    }
    onClosed?.();
  }, [canClose, onClosed, onCloseAttempt]);

  useEffect(() => {
    if (!visible) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [visible, close]);

  if (!visible) return null;

  // Upstream: presentation mode determines "floating" vs "bottom-sheet" CSS class.
  // "auto" defaults to floating on desktop.
  const modeClass = presentationMode === "bottom-sheet" ? "bottom-sheet" : "floating";

  const dialogClasses = ["gtk-dialog", "background", modeClass];
  if (className) dialogClasses.push(className);

  const sheetStyle: React.CSSProperties = {
    width: contentWidth > 0 ? contentWidth : undefined,
    height: contentHeight > 0 ? contentHeight : undefined,
    ...style,
  };

  // Mirrors the native structure:
  //   dialog-host > dialog.background.floating > floating-sheet > dimming + sheet
  // The dialog-host wrapper is omitted since on the web the dialog is portalled
  // or placed inline — SCSS rules for dialog-host > dialog still match because
  // the compiled CSS also includes bare .gtk-dialog.alert / .gtk-dialog.about rules.
  const content = (
    <div
      ref={ref}
      className={dialogClasses.join(" ")}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 1000,
      }}
      {...rest}
    >
      <div
        className="gtk-floating-sheet"
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div className="gtk-dimming" style={{ position: "absolute", inset: 0 }} onClick={close} />
        <div className="gtk-sheet" style={{ position: "relative", ...sheetStyle }}>
          {child ?? children}
        </div>
      </div>
    </div>
  );

  if (portal === true) return createPortal(content, document.body);
  if (portal instanceof HTMLElement) return createPortal(content, portal);
  return content;
});
