import {
  AdwaitaProvider,
  GtkBox,
  GtkButton,
  GtkCalendar,
  GtkCenterBox,
  GtkCheckButton,
  GtkEditableLabel,
  GtkEntry,
  GtkExpander,
  GtkFlowBox,
  GtkFlowBoxChild,
  GtkFrame,
  GtkGrid,
  GtkImage,
  GtkLabel,
  GtkLevelBar,
  GtkLinkButton,
  GtkMenuButton,
  GtkOverlay,
  GtkPaned,
  GtkPasswordEntry,
  GtkProgressBar,
  GtkScale,
  GtkScrollbar,
  GtkSearchEntry,
  GtkSeparator,
  GtkSpinButton,
  GtkSpinner,
  GtkSwitch,
  GtkTextView,
  GtkToggleButton,
  GtkWindowTitle,
} from "@gtk-js/adwaita";
import { Fragment } from "react";
import { createRoot } from "react-dom/client";

const caseName = window.location.pathname.slice(1);
const isGallery = caseName === "gallery";

const cases: Record<string, () => React.ReactElement> = {
  "button-text-default": () => <GtkButton label="Button" data-testid="target" />,
  "button-text-flat": () => <GtkButton label="Button" hasFrame={false} data-testid="target" />,
  "button-text-suggested": () => (
    <GtkButton label="Button" className="suggested-action" data-testid="target" />
  ),
  "button-text-destructive": () => (
    <GtkButton label="Button" className="destructive-action" data-testid="target" />
  ),
  "button-icon": () => <GtkButton iconName="open-menu-symbolic" data-testid="target" />,
  "button-circular": () => (
    <GtkButton iconName="open-menu-symbolic" className="circular" data-testid="target" />
  ),
  "button-pill": () => <GtkButton label="Button" className="pill" data-testid="target" />,
  "button-disabled": () => <GtkButton label="Button" disabled data-testid="target" />,

  // GtkCalendar cases
  "calendar-default": () => <GtkCalendar year={2024} month={0} day={15} data-testid="target" />,

  // GtkCheckButton cases
  "check-button-default": () => <GtkCheckButton label="Checkbox" data-testid="target" />,
  "check-button-checked": () => <GtkCheckButton label="Checkbox" active data-testid="target" />,
  "check-button-indeterminate": () => (
    <GtkCheckButton label="Checkbox" inconsistent data-testid="target" />
  ),
  "check-button-disabled": () => <GtkCheckButton label="Checkbox" disabled data-testid="target" />,
  "check-button-checked-disabled": () => (
    <GtkCheckButton label="Checkbox" active disabled data-testid="target" />
  ),
  "check-button-no-label": () => <GtkCheckButton data-testid="target" />,
  "radio-button-default": () => <GtkCheckButton label="Radio" group="test" data-testid="target" />,
  "radio-button-checked": () => (
    <GtkCheckButton label="Radio" group="test" active data-testid="target" />
  ),

  // GtkScale cases
  "scale-default": () => <GtkScale min={0} max={100} value={50} step={1} data-testid="target" />,

  // GtkEditableLabel cases
  "editable-label-display-default": () => (
    <GtkEditableLabel text="Hello World" data-testid="target" />
  ),
  "editable-label-display-empty": () => <GtkEditableLabel text="" data-testid="target" />,
  "editable-label-editing-active": () => (
    <GtkEditableLabel text="Editable" editing data-testid="target" />
  ),
  "editable-label-disabled": () => (
    <GtkEditableLabel text="Disabled" disabled data-testid="target" />
  ),

  // GtkEntry cases — ref callback puts data-testid on the outer .gtk-entry div,
  // since forwardRef<HTMLInputElement> gives the inner <input>.
  "entry-default": () => (
    <GtkEntry text="Hello" ref={(el) => el?.parentElement?.setAttribute("data-testid", "target")} />
  ),
  "entry-placeholder": () => (
    <GtkEntry
      placeholderText="Enter text..."
      ref={(el) => el?.parentElement?.setAttribute("data-testid", "target")}
    />
  ),
  "entry-flat": () => (
    <GtkEntry
      hasFrame={false}
      ref={(el) => el?.parentElement?.setAttribute("data-testid", "target")}
    />
  ),
  "entry-disabled": () => (
    <GtkEntry
      text="Hello"
      disabled
      ref={(el) => el?.parentElement?.setAttribute("data-testid", "target")}
    />
  ),
  "entry-primary-icon": () => (
    <GtkEntry
      text="Hello"
      primaryIconName="edit-find-symbolic"
      ref={(el) => el?.parentElement?.setAttribute("data-testid", "target")}
    />
  ),

  // GtkPasswordEntry cases
  "password-entry-default": () => (
    <GtkPasswordEntry ref={(el) => el?.parentElement?.setAttribute("data-testid", "target")} />
  ),
  "password-entry-peek-icon": () => (
    <GtkPasswordEntry
      showPeekIcon
      ref={(el) => el?.parentElement?.setAttribute("data-testid", "target")}
    />
  ),
  "password-entry-disabled": () => (
    <GtkPasswordEntry
      disabled
      ref={(el) => el?.parentElement?.setAttribute("data-testid", "target")}
    />
  ),

  // GtkSearchEntry cases
  "search-entry-default": () => (
    <GtkSearchEntry ref={(el) => el?.parentElement?.setAttribute("data-testid", "target")} />
  ),
  "search-entry-disabled": () => (
    <GtkSearchEntry
      disabled
      ref={(el) => el?.parentElement?.setAttribute("data-testid", "target")}
    />
  ),

  // GtkScrollbar cases
  "scrollbar-default": () => (
    <GtkScrollbar orientation="vertical" value={0} pageSize={0.2} data-testid="target" />
  ),

  // GtkImage cases
  "image-default": () => <GtkImage data-testid="target" />,
  "image-normal-icons": () => (
    <GtkImage iconName="open-menu-symbolic" iconSize="normal" data-testid="target" />
  ),
  "image-large-icons": () => (
    <GtkImage iconName="open-menu-symbolic" iconSize="large" data-testid="target" />
  ),
  "image-pixel-size-24": () => (
    <GtkImage iconName="open-menu-symbolic" pixelSize={24} data-testid="target" />
  ),
  "image-no-icon-name": () => <GtkImage iconSize="normal" data-testid="target" />,

  // GtkLabel cases
  "label-default": () => <GtkLabel label="Label" data-testid="target" />,
  "label-wrap-word": () => (
    <GtkLabel
      label="The quick brown fox jumps over the lazy dog near the river"
      wrap
      wrapMode="word"
      style={{ maxWidth: "100px" }}
      data-testid="target"
    />
  ),
  "label-wrap-char": () => (
    <GtkLabel
      label="Thequickbrownfoxjumps"
      wrap
      wrapMode="char"
      style={{ maxWidth: "80px" }}
      data-testid="target"
    />
  ),
  "label-ellipsize": () => (
    <GtkLabel
      label="This is a very long label that should be ellipsized"
      ellipsize="end"
      style={{ maxWidth: "120px" }}
      data-testid="target"
    />
  ),
  "label-justify-center": () => <GtkLabel label="Centered" justify="center" data-testid="target" />,
  "label-width-chars": () => <GtkLabel label="Hi" widthChars={20} data-testid="target" />,
  "label-xalign": () => <GtkLabel label="Aligned" xalign={0} data-testid="target" />,
  "label-disabled": () => <GtkLabel label="Label" disabled data-testid="target" />,

  // GtkLevelBar cases
  "levelbar-continuous-default": () => <GtkLevelBar value={0.5} data-testid="target" />,
  "levelbar-continuous-low": () => <GtkLevelBar value={0.1} data-testid="target" />,
  "levelbar-continuous-full": () => <GtkLevelBar value={1} data-testid="target" />,
  "levelbar-continuous-vertical": () => (
    <GtkLevelBar
      value={0.4}
      orientation="vertical"
      style={{ height: "200px" }}
      data-testid="target"
    />
  ),
  "levelbar-discrete-default": () => (
    <GtkLevelBar value={2} minValue={0} maxValue={5} mode="discrete" data-testid="target" />
  ),
  "levelbar-discrete-inverted": () => (
    <GtkLevelBar
      value={2}
      minValue={0}
      maxValue={4}
      mode="discrete"
      inverted
      data-testid="target"
    />
  ),
  "levelbar-disabled": () => <GtkLevelBar value={0.5} disabled data-testid="target" />,

  // GtkLinkButton cases
  "link-default": () => (
    <GtkLinkButton uri="https://example.com" label="Link" data-testid="target" />
  ),
  "link-visited": () => (
    <GtkLinkButton uri="https://example.com" label="Link" visited data-testid="target" />
  ),

  // GtkMenuButton cases
  "menu-button-text-default": () => <GtkMenuButton label="Button" data-testid="target" />,
  "menu-button-icon": () => <GtkMenuButton iconName="open-menu-symbolic" data-testid="target" />,
  "menu-button-flat": () => <GtkMenuButton label="Button" hasFrame={false} data-testid="target" />,
  "menu-button-circular": () => <GtkMenuButton className="circular" data-testid="target" />,
  "menu-button-disabled": () => <GtkMenuButton label="Button" disabled data-testid="target" />,

  // GtkProgressBar cases
  "progressbar-horizontal-50": () => <GtkProgressBar fraction={0.5} data-testid="target" />,
  "progressbar-horizontal-0": () => <GtkProgressBar fraction={0} data-testid="target" />,
  "progressbar-horizontal-100": () => <GtkProgressBar fraction={1} data-testid="target" />,
  "progressbar-vertical-50": () => (
    <GtkProgressBar
      fraction={0.5}
      orientation="vertical"
      style={{ height: "200px" }}
      data-testid="target"
    />
  ),
  "progressbar-inverted-50": () => <GtkProgressBar fraction={0.5} inverted data-testid="target" />,
  "progressbar-text-custom": () => (
    <GtkProgressBar fraction={0.75} showText text="Loading..." data-testid="target" />
  ),
  "progressbar-osd-horizontal": () => (
    <GtkProgressBar fraction={0.4} className="osd" data-testid="target" />
  ),
  "progressbar-fraction-small": () => <GtkProgressBar fraction={0.1} data-testid="target" />,

  // GtkSeparator cases
  "separator-horizontal-default": () => <GtkSeparator data-testid="target" />,
  "separator-vertical": () => <GtkSeparator orientation="vertical" data-testid="target" />,
  "separator-spacer-horizontal": () => <GtkSeparator className="spacer" data-testid="target" />,

  // GtkSpinner cases
  "spinner-default": () => <GtkSpinner data-testid="target" />,
  "spinner-spinning": () => <GtkSpinner spinning data-testid="target" />,
  "spinner-spinning-custom-size": () => (
    <GtkSpinner spinning style={{ width: "24px", height: "24px" }} data-testid="target" />
  ),
  "spinner-disabled-not-spinning": () => <GtkSpinner disabled data-testid="target" />,
  "spinner-disabled-spinning": () => <GtkSpinner spinning disabled data-testid="target" />,

  // GtkSpinButton cases
  "spin-button-default": () => <GtkSpinButton min={0} max={100} value={50} data-testid="target" />,
  "spin-button-vertical": () => (
    <GtkSpinButton min={0} max={100} value={50} orientation="vertical" data-testid="target" />
  ),

  // GtkSwitch cases
  "switch-off-default": () => <GtkSwitch data-testid="target" />,
  "switch-on-default": () => <GtkSwitch active data-testid="target" />,
  "switch-off-disabled": () => <GtkSwitch disabled data-testid="target" />,
  "switch-on-disabled": () => <GtkSwitch active disabled data-testid="target" />,

  // GtkTextView cases
  "text-view-default": () => <GtkTextView data-testid="target" />,
  "text-view-monospace": () => <GtkTextView monospace data-testid="target" />,
  "text-view-non-editable": () => <GtkTextView editable={false} data-testid="target" />,
  "text-view-disabled": () => <GtkTextView disabled data-testid="target" />,

  // GtkToggleButton cases
  "toggle-text-default": () => <GtkToggleButton label="Toggle" data-testid="target" />,
  "toggle-text-checked": () => <GtkToggleButton label="Toggle" active data-testid="target" />,
  "toggle-text-flat": () => (
    <GtkToggleButton label="Toggle" hasFrame={false} data-testid="target" />
  ),
  "toggle-disabled": () => <GtkToggleButton label="Toggle" disabled data-testid="target" />,

  // GtkWindowTitle cases
  "window-title-text-default": () => <GtkWindowTitle title="Window Title" data-testid="target" />,
  "window-title-with-subtitle": () => (
    <GtkWindowTitle title="Main Title" subtitle="Subtitle text" data-testid="target" />
  ),
  "window-title-long-text": () => (
    <GtkWindowTitle title="This is a very long window title text" data-testid="target" />
  ),
  "window-title-no-subtitle": () => <GtkWindowTitle title="Title" data-testid="target" />,
  "window-title-both-empty": () => <GtkWindowTitle title="" data-testid="target" />,

  // GtkBox cases
  "box-horizontal-default": () => (
    <GtkBox orientation="horizontal" data-testid="target">
      <GtkLabel label="A" />
      <GtkLabel label="B" />
      <GtkLabel label="C" />
    </GtkBox>
  ),
  "box-vertical-default": () => (
    <GtkBox orientation="vertical" data-testid="target">
      <GtkLabel label="A" />
      <GtkLabel label="B" />
      <GtkLabel label="C" />
    </GtkBox>
  ),
  "box-spacing": () => (
    <GtkBox orientation="horizontal" spacing={6} data-testid="target">
      <GtkLabel label="A" />
      <GtkLabel label="B" />
      <GtkLabel label="C" />
    </GtkBox>
  ),
  "box-homogeneous": () => (
    <GtkBox orientation="horizontal" homogeneous style={{ width: "200px" }} data-testid="target">
      <GtkLabel label="A" />
      <GtkLabel label="B" />
      <GtkLabel label="C" />
    </GtkBox>
  ),

  // GtkCenterBox cases
  "center-box-default": () => (
    <GtkCenterBox
      style={{ width: "300px" }}
      startWidget={<GtkLabel label="Start" />}
      centerWidget={<GtkLabel label="Center" />}
      endWidget={<GtkLabel label="End" />}
      data-testid="target"
    />
  ),

  // GtkGrid cases
  "grid-default": () => (
    <GtkGrid columnHomogeneous style={{ gridTemplateColumns: "1fr 1fr" }} data-testid="target">
      <GtkLabel label="TL" />
      <GtkLabel label="TR" />
      <GtkLabel label="BL" />
      <GtkLabel label="BR" />
    </GtkGrid>
  ),

  // GtkFlowBox cases
  "flow-box-default": () => (
    <GtkFlowBox selectionMode="none" data-testid="target">
      <GtkFlowBoxChild>
        <GtkLabel label="One" />
      </GtkFlowBoxChild>
      <GtkFlowBoxChild>
        <GtkLabel label="Two" />
      </GtkFlowBoxChild>
      <GtkFlowBoxChild>
        <GtkLabel label="Three" />
      </GtkFlowBoxChild>
      <GtkFlowBoxChild>
        <GtkLabel label="Four" />
      </GtkFlowBoxChild>
    </GtkFlowBox>
  ),

  // GtkPaned cases
  "paned-horizontal": () => (
    <GtkPaned
      orientation="horizontal"
      position={100}
      startChild={<GtkLabel label="Start" />}
      endChild={<GtkLabel label="End" />}
      data-testid="target"
    />
  ),
  "paned-vertical": () => (
    <GtkPaned
      orientation="vertical"
      position={60}
      startChild={<GtkLabel label="Start" />}
      endChild={<GtkLabel label="End" />}
      data-testid="target"
    />
  ),

  // GtkFrame cases
  "frame-default": () => (
    <GtkFrame label="Frame" data-testid="target">
      <GtkLabel label="Content" />
    </GtkFrame>
  ),
  "frame-no-label": () => (
    <GtkFrame data-testid="target">
      <GtkLabel label="Content" />
    </GtkFrame>
  ),

  // GtkExpander cases
  "expander-default": () => <GtkExpander label="Expander" data-testid="target" />,
  "expander-expanded": () => (
    <GtkExpander label="Expander" expanded data-testid="target">
      <GtkLabel label="Content" />
    </GtkExpander>
  ),

  // GtkOverlay cases
  "overlay-default": () => (
    <GtkOverlay
      child={<GtkLabel label="Base" />}
      overlays={[<GtkLabel label="Overlay" />]}
      style={{ width: "200px", height: "100px" }}
      data-testid="target"
    />
  ),

  // Expected-failure cases: intentionally broken for testing the comparison
  "button-text-default-wrong-padding": () => (
    <GtkButton label="Button" style={{ padding: "20px" }} data-testid="target" />
  ),
  "button-text-default-wrong-radius": () => (
    <GtkButton label="Button" style={{ borderRadius: "0px" }} data-testid="target" />
  ),
  "button-text-default-wrong-bg": () => (
    <GtkButton label="Button" style={{ backgroundColor: "red" }} data-testid="target" />
  ),
};

const root = createRoot(document.getElementById("root")!);

if (isGallery) {
  root.render(
    <AdwaitaProvider colorScheme="light">
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, max-content)", gap: 24 }}>
        {Object.entries(cases).map(([name, renderCase]) => (
          <div
            key={name}
            data-case={name}
            style={{ display: "inline-flex", alignItems: "flex-start" }}
          >
            <Fragment>{renderCase()}</Fragment>
          </div>
        ))}
      </div>
    </AdwaitaProvider>,
  );
} else {
  const renderCase = cases[caseName];
  if (!renderCase) {
    document.getElementById("root")!.textContent = `Unknown case: ${caseName}`;
  } else {
    root.render(<AdwaitaProvider colorScheme="light">{renderCase()}</AdwaitaProvider>);
  }
}
