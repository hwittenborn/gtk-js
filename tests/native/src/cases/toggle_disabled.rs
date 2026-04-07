use gtk::prelude::*;
use relm4::prelude::*;

pub struct ToggleDisabled;

#[relm4::component(pub)]
impl SimpleComponent for ToggleDisabled {
    type Init = ();
    type Input = ();
    type Output = ();

    view! {
        gtk::ToggleButton {
            set_label: "Toggle",
            set_sensitive: false,
        }
    }

    fn init(_: (), root: Self::Root, _sender: ComponentSender<Self>) -> ComponentParts<Self> {
        let model = Self;
        let widgets = view_output!();
        ComponentParts { model, widgets }
    }
}
