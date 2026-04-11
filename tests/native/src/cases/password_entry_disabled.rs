use gtk::prelude::*;
use relm4::prelude::*;

pub struct PasswordEntryDisabled;

#[relm4::component(pub)]
impl SimpleComponent for PasswordEntryDisabled {
    type Init = ();
    type Input = ();
    type Output = ();

    view! {
        gtk::PasswordEntry {
            set_sensitive: false,
        }
    }

    fn init(_: (), root: Self::Root, _sender: ComponentSender<Self>) -> ComponentParts<Self> {
        let model = Self;
        let widgets = view_output!();
        ComponentParts { model, widgets }
    }
}
