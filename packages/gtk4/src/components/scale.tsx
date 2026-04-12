import React, { forwardRef, type HTMLAttributes, useCallback, useRef, useState } from "react";
import {
  alignAttrs,
  type GtkAlignProps,
  type GtkOrientation,
  type GtkPositionType,
} from "../types.ts";

export interface GtkScaleMark {
  value: number;
  position?: GtkPositionType;
  label?: string;
}

export interface GtkScaleProps extends HTMLAttributes<HTMLDivElement>, GtkAlignProps {
  /** Current value. */
  value?: number;
  /** Minimum value. Default: 0. */
  min?: number;
  /** Maximum value. Default: 100. */
  max?: number;
  /** Step increment for keyboard. Default: 1. */
  step?: number;
  /** Layout direction. Default: "horizontal". */
  orientation?: GtkOrientation;
  /** Whether to show the current value label. Default: false. */
  drawValue?: boolean;
  /** Position of the value label. Default: "top". */
  valuePos?: GtkPositionType;
  /** Whether to show origin highlight. Default: true. */
  hasOrigin?: boolean;
  /** Whether the scale is inverted. Default: false. */
  inverted?: boolean;
  /** Decimal places for the value label. Default: 1. */
  digits?: number;
  /** Scale marks. */
  marks?: GtkScaleMark[];
  /** Callback when value changes. */
  onValueChanged?: (value: number) => void;
}

/**
 * GtkScale — A slider widget for selecting a value from a range.
 *
 * CSS node:
 *   scale[.horizontal|.vertical][.marks-before][.marks-after][.fine-tune]
 *     ├── value[.top|.bottom|.left|.right]
 *     ├── marks.top / marks.bottom
 *     │   └── mark > indicator + [label]
 *     └── trough
 *         ├── highlight
 *         └── slider
 *
 * @see https://docs.gtk.org/gtk4/class.Scale.html
 */
export const GtkScale = forwardRef<HTMLDivElement, GtkScaleProps>(function GtkScale(
  {
    value: controlledValue,
    min = 0,
    max = 100,
    step = 1,
    orientation = "horizontal",
    drawValue = false,
    valuePos = "top",
    hasOrigin = true,
    inverted = false,
    digits = 1,
    marks,
    onValueChanged,
    halign,
    valign,
    className,
    ...rest
  },
  ref,
) {
  const isControlled = controlledValue !== undefined;
  const [internalValue, setInternalValue] = useState(min);
  const value = isControlled ? controlledValue : internalValue;

  const troughRef = useRef<HTMLDivElement>(null);
  const [fineTune, setFineTune] = useState(false);

  const fraction = max > min ? (value - min) / (max - min) : 0;
  const displayFraction = inverted ? 1 - fraction : fraction;

  const hasMarksBefore = marks?.some(
    (m) => (m.position ?? "bottom") === "top" || (m.position ?? "bottom") === "left",
  );
  const hasMarksAfter = marks?.some(
    (m) => (m.position ?? "bottom") === "bottom" || (m.position ?? "bottom") === "right",
  );

  const classes = ["gtk-scale", orientation];
  if (hasMarksBefore) classes.push("marks-before");
  if (hasMarksAfter) classes.push("marks-after");
  if (fineTune) classes.push("fine-tune");
  if (className) classes.push(className);

  const clampAndSnap = useCallback(
    (raw: number): number => {
      let v = Math.max(min, Math.min(max, raw));
      // Snap to marks within 12px equivalent
      if (marks) {
        const range = max - min;
        const snapThreshold = range * 0.03; // ~3% of range
        for (const mark of marks) {
          if (Math.abs(v - mark.value) < snapThreshold) {
            v = mark.value;
            break;
          }
        }
      }
      // Round to step
      v = Math.round(v / step) * step;
      return Math.max(min, Math.min(max, v));
    },
    [min, max, step, marks],
  );

  const updateFromPointer = useCallback(
    (clientX: number, clientY: number) => {
      const trough = troughRef.current;
      if (!trough) return;
      const rect = trough.getBoundingClientRect();
      let frac: number;
      if (orientation === "horizontal") {
        frac = (clientX - rect.left) / rect.width;
      } else {
        frac = (clientY - rect.top) / rect.height;
      }
      if (inverted) frac = 1 - frac;
      const raw = min + frac * (max - min);
      const snapped = clampAndSnap(raw);
      if (!isControlled) setInternalValue(snapped);
      onValueChanged?.(snapped);
    },
    [orientation, inverted, min, max, isControlled, clampAndSnap, onValueChanged],
  );

  const handlePointerDown = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (e.button !== 0) return;
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
      setFineTune(e.shiftKey);
      updateFromPointer(e.clientX, e.clientY);
    },
    [updateFromPointer],
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (!(e.currentTarget as HTMLElement).hasPointerCapture(e.pointerId)) return;
      setFineTune(e.shiftKey);
      updateFromPointer(e.clientX, e.clientY);
    },
    [updateFromPointer],
  );

  const handlePointerUp = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
    setFineTune(false);
  }, []);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      let newValue = value;
      const inc = e.shiftKey ? step * 0.1 : step;
      if (e.key === "ArrowRight" || e.key === "ArrowUp") {
        newValue = clampAndSnap(value + (inverted ? -inc : inc));
      } else if (e.key === "ArrowLeft" || e.key === "ArrowDown") {
        newValue = clampAndSnap(value - (inverted ? -inc : inc));
      } else if (e.key === "Home") {
        newValue = inverted ? max : min;
      } else if (e.key === "End") {
        newValue = inverted ? min : max;
      } else {
        return;
      }
      e.preventDefault();
      if (!isControlled) setInternalValue(newValue);
      onValueChanged?.(newValue);
    },
    [value, step, min, max, inverted, isControlled, clampAndSnap, onValueChanged],
  );

  const isHoriz = orientation === "horizontal";
  // GTK highlight grows to the center of the slider handle:
  // width = fraction * (trough_width - slider_width) + slider_width / 2
  // As CSS: calc(fraction * (100% - 20px) + 10px)
  const highlightStyle: React.CSSProperties = isHoriz
    ? { width: displayFraction <= 0 ? "0px" : `calc(${displayFraction} * (100% - 20px) + 10px)` }
    : { height: displayFraction <= 0 ? "0px" : `calc(${displayFraction} * (100% - 20px) + 10px)` };
  // GTK positions slider at: (trough_size - slider_size) * fraction
  // As CSS: left = fraction * (100% - slider_min_size)
  // slider min-size is 20px per adwaita CSS
  const sliderStyle: React.CSSProperties = isHoriz
    ? { left: `calc(${displayFraction} * (100% - 20px))` }
    : { top: `calc(${displayFraction} * (100% - 20px))` };

  return (
    <div
      ref={ref}
      role="slider"
      aria-valuenow={value}
      aria-valuemin={min}
      aria-valuemax={max}
      aria-orientation={orientation}
      tabIndex={0}
      className={classes.join(" ")}
      {...alignAttrs(halign, valign)}
      onKeyDown={handleKeyDown}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      {...rest}
    >
      {drawValue && <span className={`gtk-value ${valuePos}`}>{value.toFixed(digits)}</span>}
      <div ref={troughRef} className="gtk-trough">
        {hasOrigin && <div className="gtk-highlight" style={highlightStyle} />}
        <div className="gtk-slider" style={sliderStyle} />
      </div>
      {marks && marks.length > 0 && (
        <div className="gtk-marks">
          {marks.map((mark, i) => (
            <div
              key={i}
              className="gtk-mark"
              style={
                isHoriz
                  ? { left: `${((mark.value - min) / (max - min)) * 100}%` }
                  : { top: `${((mark.value - min) / (max - min)) * 100}%` }
              }
            >
              <div className="gtk-indicator" />
              {mark.label && <span className="gtk-label">{mark.label}</span>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
});
