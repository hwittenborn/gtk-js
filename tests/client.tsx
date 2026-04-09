import {
  AdwaitaProvider,
  GtkButton,
  GtkLinkButton,
  GtkMenuButton,
  GtkToggleButton,
} from "@gtk-js/adwaita";
import { createRoot } from "react-dom/client";
import { Fragment } from "react";

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

  // GtkToggleButton cases
  "toggle-text-default": () => <GtkToggleButton label="Toggle" data-testid="target" />,
  "toggle-text-checked": () => <GtkToggleButton label="Toggle" active data-testid="target" />,
  "toggle-text-flat": () => (
    <GtkToggleButton label="Toggle" hasFrame={false} data-testid="target" />
  ),
  "toggle-disabled": () => <GtkToggleButton label="Toggle" disabled data-testid="target" />,

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
          <div key={name} data-case={name} style={{ display: "inline-flex", alignItems: "flex-start" }}>
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
