import { forwardRef, type HTMLAttributes, type ReactNode, useCallback, useEffect } from "react";
import { createPortal } from "react-dom";
import type { AdwResponseAppearance } from "../types.ts";

export interface AdwAlertDialogResponse {
  id: string;
  label: string;
  appearance?: AdwResponseAppearance;
  enabled?: boolean;
}

export interface AdwAlertDialogProps extends HTMLAttributes<HTMLDivElement> {
  heading?: string;
  headingUseMarkup?: boolean;
  body?: string;
  bodyUseMarkup?: boolean;
  extraChild?: ReactNode;
  preferWideLayout?: boolean;
  responses?: AdwAlertDialogResponse[];
  defaultResponse?: string;
  closeResponse?: string;
  visible?: boolean;
  portal?: boolean | HTMLElement;
  onResponse?: (id: string) => void;
}

/**
 * AdwAlertDialog — A modal alert with heading, body, and response buttons.
 *
 * Upstream CSS node: dialog.alert (inherits from AdwDialog with css_name "dialog")
 * Upstream UI template sets: follows-content-size=true, presentation-mode=floating,
 *   CSS class "alert"
 *
 * Native child structure (inside the dialog's sheet):
 *   AdwGizmo (contents) > GtkWindowHandle > GtkBox(vertical)
 *     > GtkScrolledWindow.body-scrolled-window
 *       > GtkBox.message-area[.has-heading][.has-body](vertical)
 *         > AdwGizmo.heading-bin > GtkLabel.title-2 (heading)
 *         > GtkLabel.body (body text)
 *         > AdwBin.child (extra child)
 *     > AdwGizmo.response-area
 *       > button[.suggested-action|.destructive-action]
 *
 * @see https://gnome.pages.gitlab.gnome.org/libadwaita/doc/1-latest/class.AlertDialog.html
 */
export const AdwAlertDialog = forwardRef<HTMLDivElement, AdwAlertDialogProps>(
  function AdwAlertDialog(
    {
      heading,
      headingUseMarkup = false,
      body,
      bodyUseMarkup = false,
      extraChild,
      preferWideLayout = false,
      responses = [],
      defaultResponse,
      closeResponse = "close",
      visible = false,
      portal = false,
      onResponse,
      className,
      ...rest
    },
    ref,
  ) {
    const handleClose = useCallback(() => onResponse?.(closeResponse), [onResponse, closeResponse]);

    useEffect(() => {
      if (!visible) return;
      const handleKey = (e: KeyboardEvent) => {
        if (e.key === "Escape") handleClose();
      };
      document.addEventListener("keydown", handleKey);
      return () => document.removeEventListener("keydown", handleKey);
    }, [visible, handleClose]);

    if (!visible) return null;

    const dialogClasses = ["gtk-dialog", "alert", "background", "floating"];
    if (className) dialogClasses.push(className);

    // Upstream: .message-area gets .has-heading / .has-body conditionally,
    // which the SCSS uses for border-spacing (10px when both, 24px otherwise).
    const messageAreaClasses = ["message-area"];
    if (heading) messageAreaClasses.push("has-heading");
    if (body) messageAreaClasses.push("has-body");

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
          <div
            className="gtk-dimming"
            style={{ position: "absolute", inset: 0 }}
            onClick={handleClose}
          />
          <div
            className="gtk-sheet"
            style={{ position: "relative", maxWidth: preferWideLayout ? 600 : 372 }}
          >
            {/* AdwGizmo "contents" — no CSS class, just a layout container */}
            <div>
              <div className="gtk-windowhandle">
                <div className="gtk-box gtk-box-layout vertical">
                  <div className="body-scrolled-window" style={{ overflow: "auto" }}>
                    <div className={messageAreaClasses.join(" ")}>
                      {heading && (
                        <div className="heading-bin">
                          <span className="gtk-label title-2">{heading}</span>
                        </div>
                      )}
                      {body && <span className="gtk-label body">{body}</span>}
                      {extraChild && <div className="child">{extraChild}</div>}
                    </div>
                  </div>
                  <div className="response-area">
                    {responses.map((resp) => {
                      const btnClasses = ["gtk-button"];
                      if (resp.appearance === "suggested") btnClasses.push("suggested-action");
                      if (resp.appearance === "destructive") btnClasses.push("destructive-action");
                      if (resp.id === defaultResponse) btnClasses.push("default");
                      return (
                        <button
                          key={resp.id}
                          type="button"
                          className={btnClasses.join(" ")}
                          disabled={resp.enabled === false}
                          onClick={() => onResponse?.(resp.id)}
                        >
                          <span className="gtk-label">{resp.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );

    if (portal === true) return createPortal(content, document.body);
    if (portal instanceof HTMLElement) return createPortal(content, portal);
    return content;
  },
);
