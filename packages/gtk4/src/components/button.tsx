import React, {
  type ButtonHTMLAttributes,
  forwardRef,
  type ReactNode,
  useCallback,
  useState,
} from "react";
import { alignAttrs, type GtkAlignProps } from "../types.ts";

export interface GtkButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children">,
    GtkAlignProps {
  /** Text label displayed in the button. Creates an internal GtkLabel. */
  label?: string;
  /** Icon name for the button. Creates an internal GtkImage. */
  iconName?: string;
  /** Whether the button has a visible frame. When false, adds the .flat class. */
  hasFrame?: boolean;
  /** Whether the label can shrink (ellipsize). */
  canShrink?: boolean;
  /** Callback when the button is clicked. */
  onClicked?: () => void;
  /** Custom child widget. Overrides label/iconName if provided. */
  children?: ReactNode;
}

/**
 * GtkButton — A widget that emits a signal when clicked.
 *
 * CSS node:
 *   button[.flat][.text-button][.image-button]
 *     └── <child>
 *
 * @see https://docs.gtk.org/gtk4/class.Button.html
 */
export const GtkButton = forwardRef<HTMLButtonElement, GtkButtonProps>(function GtkButton(
  {
    label,
    iconName,
    hasFrame = true,
    canShrink = false,
    onClicked,
    children,
    halign,
    valign,
    className,
    onKeyDown,
    onKeyUp,
    onClick,
    ...rest
  },
  ref,
) {
  const [keyboardActivating, setKeyboardActivating] = useState(false);

  const hasCustomChild = children != null;
  const hasLabel = !hasCustomChild && label != null;
  const hasIcon = !hasCustomChild && iconName != null;

  const classes = ["gtk-button"];
  if (!hasFrame) classes.push("flat");
  if (hasLabel && !hasIcon) classes.push("text-button");
  if (hasIcon && !hasLabel) classes.push("image-button");
  if (hasIcon && hasLabel) classes.push("image-text-button");
  if (keyboardActivating) classes.push("keyboard-activating");
  if (className) classes.push(className);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLButtonElement>) => {
      if (e.key === " " || e.key === "Enter") {
        setKeyboardActivating(true);
      }
      onKeyDown?.(e);
    },
    [onKeyDown],
  );

  const handleKeyUp = useCallback(
    (e: React.KeyboardEvent<HTMLButtonElement>) => {
      if (e.key === " " || e.key === "Enter") {
        setKeyboardActivating(false);
      }
      onKeyUp?.(e);
    },
    [onKeyUp],
  );

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      onClicked?.();
      onClick?.(e);
    },
    [onClicked, onClick],
  );

  return (
    <button
      ref={ref}
      className={classes.join(" ")}
      {...alignAttrs(halign, valign)}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      onKeyUp={handleKeyUp}
      {...rest}
    >
      {hasCustomChild ? (
        children
      ) : (
        <>
          {hasIcon && <span className="gtk-image" />}
          {hasLabel && (
            <span
              className="gtk-label"
              style={canShrink ? { overflow: "hidden", textOverflow: "ellipsis" } : undefined}
            >
              {label}
            </span>
          )}
        </>
      )}
    </button>
  );
});
