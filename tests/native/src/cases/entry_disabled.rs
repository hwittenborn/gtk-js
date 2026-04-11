use gtk::prelude::*;
use relm4::prelude::*;

pub struct EntryDisabled;

#[relm4::component(pub)]
impl SimpleComponent for EntryDisabled {
    type Init = ();
    type Input = ();
    type Output = ();

    view! {
        gtk::Entry {
            set_text: "Hello",
            set_sensitive: false,
        }
    }

    fn init(_: (), root: Self::Root, _sender: ComponentSender<Self>) -> ComponentParts<Self> {
        let model = Self;
        let widgets = view_output!();
        ComponentParts { model, widgets }
    }
}
