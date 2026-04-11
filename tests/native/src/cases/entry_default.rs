use gtk::prelude::*;
use relm4::prelude::*;

pub struct EntryDefault;

#[relm4::component(pub)]
impl SimpleComponent for EntryDefault {
    type Init = ();
    type Input = ();
    type Output = ();

    view! {
        gtk::Entry {
            set_text: "Hello",
        }
    }

    fn init(_: (), root: Self::Root, _sender: ComponentSender<Self>) -> ComponentParts<Self> {
        let model = Self;
        let widgets = view_output!();
        ComponentParts { model, widgets }
    }
}
