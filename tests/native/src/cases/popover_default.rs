use gtk::prelude::*;
use relm4::prelude::*;

pub struct PopoverDefault;

#[relm4::component(pub)]
impl SimpleComponent for PopoverDefault {
    type Init = ();
    type Input = ();
    type Output = ();

    view! {
        gtk::Box {
            gtk::Label { set_label: "Anchor" },
        }
    }

    fn init(_: (), root: Self::Root, _sender: ComponentSender<Self>) -> ComponentParts<Self> {
        let widgets = view_output!();

        // Attach a popover to the box but don't popup() — the widget isn't
        // in a window yet, so GTK can't create the popup surface.
        // The test compares the outer box; the popover child won't have
        // valid dimensions until harness support for popup surfaces is added.
        let popover = gtk::Popover::new();
        popover.set_child(Some(&gtk::Label::new(Some("Popover content"))));
        popover.set_parent(&root);
        popover.set_autohide(false);

        let model = Self;
        ComponentParts { model, widgets }
    }
}
