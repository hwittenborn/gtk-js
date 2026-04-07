use gtk::prelude::*;
use relm4::prelude::*;

pub struct MenuButtonDisabled;

#[relm4::component(pub)]
impl SimpleComponent for MenuButtonDisabled {
    type Init = ();
    type Input = ();
    type Output = ();

    view! {
        gtk::MenuButton {
            set_label: "Button",
            set_popover: Some(&gtk::Popover::new()),
            set_sensitive: false,
        }
    }

    fn init(_: (), root: Self::Root, _sender: ComponentSender<Self>) -> ComponentParts<Self> {
        let model = Self;
        let widgets = view_output!();
        ComponentParts { model, widgets }
    }
}
