import { AdwaitaProvider, GtkButton } from "@gtk-js/adwaita";
import { createRoot } from "react-dom/client";

const caseName = window.location.pathname.slice(1);

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

const renderCase = cases[caseName];

if (!renderCase) {
  document.getElementById("root")!.textContent = `Unknown case: ${caseName}`;
} else {
  const root = createRoot(document.getElementById("root")!);
  root.render(<AdwaitaProvider colorScheme="light">{renderCase()}</AdwaitaProvider>);
}
