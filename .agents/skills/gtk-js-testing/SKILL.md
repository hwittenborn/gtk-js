---
name: gtk-js-testing
description: Structural regression tests comparing native GTK vs web rendering. How to run tests, add new test cases, and what gets compared.
---

# Structural Regression Tests

Tests live in `tests/` and compare native GTK4/Adwaita rendering (Rust/relm4) against web React rendering (Playwright). Each test case extracts CSS properties from both sides and compares with tolerances.

## Running tests

- `bun test` — run all tests
- `bun test <filter>` — run tests matching substring (e.g. `bun test toggle`, `bun test button`)
- Tests run against both Chromium and Firefox (2 tests per case)

## Adding a new test case

Three places need changes for each case:

### 1. Native side (`tests/native/src/cases/`)

Create a Rust file with a `SimpleComponent` rendering the widget via relm4:

```rust
use gtk::prelude::*;
use relm4::prelude::*;

pub struct ToggleTextDefault;

#[relm4::component(pub)]
impl SimpleComponent for ToggleTextDefault {
    type Init = ();
    type Input = ();
    type Output = ();

    view! {
        gtk::ToggleButton {
            set_label: "Toggle",
        }
    }

    fn init(_: (), root: Self::Root, _sender: ComponentSender<Self>) -> ComponentParts<Self> {
        let model = Self;
        let widgets = view_output!();
        ComponentParts { model, widgets }
    }
}
```

Then register it:
- Add `pub mod <case_name>;` in `tests/native/src/cases/mod.rs`
- Add a `Command` enum variant and match arm in `tests/native/src/main.rs`

### 2. Web side (`tests/client.tsx`)

Add a case entry mapping the kebab-case name to a React element with `data-testid="target"`:

```tsx
"toggle-text-default": () => <GtkToggleButton label="Toggle" data-testid="target" />,
```

Import any new components from `@gtk-js/adwaita` at the top of the file.

### 3. Test file (`tests/cases/`)

Create `<case-name>.test.ts`:

```ts
import { gtkTest } from "../harness";

gtkTest("toggle-text-default");
```

Use `gtkTestExpectFailure("<case-name>", ["prop"])` for intentional-failure sanity checks.

## What gets compared

The harness compares these properties (with tolerances):

| Property | Tolerance |
|----------|-----------|
| `padding` (4 sides) | 0.5px |
| `border_radius` (4 corners) | 0.5px, clamped to min(w,h)/2 |
| `background_color` | 1/255 per channel |
| `border_widths` (4 sides) | 0.5px |
| `border_colors` (4 sides) | 1/255 per channel |
| `color` (text) | 1/255 per channel |
| `font_family` | normalized (Adwaita Sans = Cantarell) |
| `font_weight` | 0.5 |
| `opacity` | 0.5 |

## Naming conventions

- Case names are kebab-case: `toggle-text-default`, `button-icon`
- Rust module names are snake_case: `toggle_text_default`, `button_icon`
- Rust struct names are PascalCase: `ToggleTextDefault`, `ButtonIcon`
- CLI subcommands are PascalCase matching the struct: `ToggleTextDefault`
