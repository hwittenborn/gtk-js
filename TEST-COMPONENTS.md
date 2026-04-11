# Component Test Coverage

Structural regression tests comparing native GTK4/Adwaita rendering against web rendering via GSK render nodes.

## Completed

### GTK4 Components

- [x] GtkButton
  - [x] text-default
  - [x] text-flat
  - [x] text-suggested
  - [x] text-destructive
  - [x] icon
  - [x] circular
  - [x] pill
  - [x] disabled
- [x] GtkToggleButton
  - [x] text-default
  - [x] text-checked
  - [x] text-flat
  - [x] disabled
- [x] GtkLinkButton
  - [x] default
  - [x] visited
- [x] GtkMenuButton
  - [x] text-default
  - [x] icon
  - [x] flat
  - [x] circular
  - [x] disabled
- [x] GtkCheckButton
  - [x] default
  - [x] checked
  - [x] indeterminate
  - [x] disabled
  - [x] checked-disabled
  - [x] no-label
  - [x] radio-default (group mode)
  - [x] radio-checked (group mode)
- [x] GtkSwitch
  - [x] off-default
  - [x] on-default
  - [x] off-disabled
  - [x] on-disabled
- [x] GtkLabel
  - [x] default
  - [x] wrap-word
  - [x] wrap-char
  - [x] ellipsize
  - [x] justify-center
  - [x] width-chars
  - [x] xalign
  - [x] disabled
- [x] GtkImage
  - [x] default
  - [x] normal-icons
  - [x] large-icons
  - [x] pixel-size-24
  - [x] no-icon-name
- [x] GtkEntry
  - [x] default
  - [x] placeholder
  - [x] flat
  - [x] disabled
  - [x] primary-icon
- [x] GtkPasswordEntry
  - [x] default
  - [x] peek-icon
  - [x] disabled
- [x] GtkSearchEntry
  - [x] default
  - [x] disabled
- [x] GtkEditableLabel
  - [x] display-default
  - [x] display-empty
  - [x] editing-active
  - [x] disabled
- [x] GtkTextView
  - [x] default
  - [x] monospace
  - [x] non-editable
  - [x] disabled
- [x] GtkSpinButton
  - [x] default
  - [x] vertical
- [x] GtkProgressBar
  - [x] horizontal-50
  - [x] horizontal-0
  - [x] horizontal-100
  - [x] vertical-50
  - [x] inverted-50
  - [x] text-custom
  - [x] osd-horizontal
  - [x] fraction-small
- [x] GtkLevelBar
  - [x] continuous-default
  - [x] continuous-low
  - [x] continuous-full
  - [x] continuous-vertical
  - [x] discrete-default
  - [x] discrete-inverted
  - [x] disabled
- [x] GtkSpinner
  - [x] default
  - [x] spinning
  - [x] spinning-custom-size
  - [x] disabled-not-spinning
  - [x] disabled-spinning
- [x] GtkSeparator
  - [x] horizontal-default
  - [x] vertical
  - [x] spacer-horizontal
- [x] GtkWindowTitle
  - [x] text-default
  - [x] with-subtitle
  - [x] long-text
  - [x] no-subtitle
  - [x] both-empty

---

## Cycles

### ~~Cycle 1 — Display Primitives~~ ✓ Complete

**Goal:** Cover the non-interactive, purely visual widgets that render content without accepting user input. These are the simplest possible test cases and establish baseline confidence in text rendering, image painting, and indicator animation. Getting these right early also validates the core CSS pipeline (font metrics, icon sizing, spinner keyframes) before more complex widgets depend on them.

- [x] GtkLabel
- [x] GtkImage
- [x] GtkSeparator
- [x] GtkSpinner

---

### ~~Cycle 2 — Toggle Controls~~ ✓ Complete

**Goal:** Cover binary-state interactive controls — widgets whose entire job is to be on or off. These are simple enough to implement quickly but exercise the interactive state machinery (`:checked`, focus rings, disabled states) that every subsequent input widget will rely on. Getting the checked/unchecked visual delta right here pays dividends across the whole test suite.

- [x] GtkCheckButton
- [x] GtkSwitch

---

### ~~Cycle 3 — Text & Number Input~~ ✓ Complete

**Goal:** Cover widgets that accept typed user input. This cycle is the first to involve the GTK input framework in earnest: cursor rendering, placeholder text, entry borders, focus halos, and the number-spinner increment/decrement controls. The password and search entries are variations of the base entry and should share most infrastructure, so they're grouped here to amortize the setup cost.

- [x] GtkEntry
- [x] GtkPasswordEntry
- [x] GtkSearchEntry
- [x] GtkEditableLabel
- [x] GtkTextView
- [x] GtkSpinButton

---

### Cycle 4 — Value Controls & Indicators

**Goal:** Cover widgets that represent a continuous or ranged value — either for user manipulation (scale, spin) or passive display (progress, level). GtkCalendar is included here because it is a self-contained date-picker with no children; it fits "ranged value" more than any other category. GtkScrollBar is here rather than with GtkScrolledWindow because it is a standalone visual indicator of position within a range.

- [ ] GtkScale
- [x] GtkProgressBar
- [x] GtkLevelBar
- [ ] GtkScrollBar
- [ ] GtkCalendar

---

### Cycle 5 — Layout Containers

**Goal:** Cover structural container widgets that exist solely to arrange their children — they have no meaningful interactive content of their own. The test strategy here is to populate each container with a small fixed set of child widgets and compare the resulting layout geometry (child positions, gaps, alignment) between native and web. GtkOverlay and GtkExpander are included here even though they are slightly interactive, because their primary role is structural containment.

- [ ] GtkBox
- [ ] GtkCenterBox
- [ ] GtkGrid
- [ ] GtkFlowBox
- [ ] GtkPaned
- [ ] GtkFrame
- [ ] GtkExpander
- [ ] GtkOverlay

---

### Cycle 6 — Navigation & Selection

**Goal:** Cover widgets that either navigate between views or present a list of choices to the user. GtkStack and GtkNotebook switch visible content; GtkPopover and GtkDropDown present transient overlays; GtkListBox renders a selectable list. GtkScrolledWindow is included here because it is most commonly used as a viewport around a GtkListBox or other tall child, and testing them together covers the clipping/overflow interaction.

- [ ] GtkScrolledWindow
- [ ] GtkStack
- [ ] GtkNotebook
- [ ] GtkPopover
- [ ] GtkDropDown
- [ ] GtkListBox

---

### Cycle 7 — Shell Chrome

**Goal:** Cover the structural widgets that form the visible frame of a GTK application window. GtkHeaderBar, GtkActionBar, and GtkSearchBar are toolbar-style bars that attach to specific edges of the window. GtkWindowTitle is a small label pair embedded inside a header bar. GtkWindow is the outermost container and the last to be tested because it depends on all the chrome widgets above being correct first. This cycle effectively validates that a complete application shell renders faithfully.

- [ ] GtkHeaderBar
- [ ] GtkActionBar
- [ ] GtkSearchBar
- [x] GtkWindowTitle
- [ ] GtkWindow

---

### Cycle 8 — Adwaita Standalone Widgets

**Goal:** Cover self-contained Adwaita display and utility components that don't depend on other Adwaita widgets to be meaningful. AdwAvatar renders a user avatar with initials or image fallback. AdwBanner is a full-width informational strip. AdwStatusPage is an empty-state hero widget. AdwClamp constrains its child to a maximum width. AdwCarousel is a swipeable page view. AdwToastOverlay renders non-modal notification toasts. These are all leaf-level or near-leaf widgets and form a clean first Adwaita cycle before the more compositional row/preference widgets.

- [ ] AdwAvatar
- [ ] AdwBanner
- [ ] AdwStatusPage
- [ ] AdwClamp
- [ ] AdwCarousel
- [ ] AdwToastOverlay

---

### Cycle 9 — Adwaita Action Widgets

**Goal:** Cover Adwaita-specific interactive controls that go beyond what GTK4 provides natively. AdwButtonContent is the internal content widget used inside buttons that combine an icon and a label. AdwButtonRow is a list-row variant styled as a button. AdwSplitButton combines a main action button with a dropdown arrow. AdwToggleGroup is a segmented control for choosing one option from a small set. These four widgets are closely related in purpose and share significant CSS infrastructure, so they're grouped to allow the subagent to reuse patterns across them.

- [ ] AdwButtonContent
- [ ] AdwButtonRow
- [ ] AdwSplitButton
- [ ] AdwToggleGroup

---

### Cycle 10 — Adwaita Rows & Preferences

**Goal:** Cover the full Adwaita list-row and preferences hierarchy. All Adw*Row widgets are visual variants of the same underlying list-row pattern (title + subtitle + optional control on the trailing edge), so they share most of their CSS and can be tested together efficiently. AdwPreferencesGroup and AdwPreferencesPage sit above the rows in the hierarchy — they require the rows to be working first, so they close out the cycle. This is the largest cycle by count but the per-widget cost is low because each row is a minor variation on a common template.

- [ ] AdwActionRow
- [ ] AdwEntryRow
- [ ] AdwPasswordEntryRow
- [ ] AdwSpinRow
- [ ] AdwComboRow
- [ ] AdwSwitchRow
- [ ] AdwExpanderRow
- [ ] AdwPreferencesRow
- [ ] AdwPreferencesGroup
- [ ] AdwPreferencesPage

---

### Cycle 11 — Adwaita Dialogs

**Goal:** Cover Adwaita's overlay modal presentation layer. AdwDialog is the base modal; AdwAlertDialog adds a title, body, and response buttons for confirmations and errors; AdwAboutDialog is a fully structured dialog for application metadata. These three form a natural hierarchy and are grouped together so the subagent can build from the base dialog upward without switching context.

- [ ] AdwDialog
- [ ] AdwAlertDialog
- [ ] AdwAboutDialog

---

### Cycle 12 — Adwaita Shell & Navigation

**Goal:** Cover the full Adwaita application layout scaffolding — the most architecturally complex cycle in the suite. AdwHeaderBar is Adwaita's enhanced header bar. AdwToolbarView attaches header/footer bars to a content area. AdwViewSwitcher provides tab-style navigation integrated into a toolbar. AdwBreakpointBin enables responsive layout by switching child configurations at breakpoints. AdwNavigationView implements push/pop navigation with animated transitions. AdwOverlaySplitView is a sidebar pattern that can overlay or split depending on available width. AdwWindow is the top-level application window that composes all of the above. These widgets only make full sense in combination, so they are tested together as an integrated app shell. This cycle is intentionally last because it depends on nearly every prior cycle being correct.

- [ ] AdwHeaderBar
- [ ] AdwToolbarView
- [ ] AdwViewSwitcher
- [ ] AdwBreakpointBin
- [ ] AdwNavigationView
- [ ] AdwOverlaySplitView
- [ ] AdwWindow
