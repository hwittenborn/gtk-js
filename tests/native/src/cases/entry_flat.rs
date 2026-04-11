use gtk::prelude::*;
use relm4::prelude::*;

pub struct EntryFlat;

#[relm4::component(pub)]
impl SimpleComponent for EntryFlat {
    type Init = ();
    type Input = ();
    type Output = ();

    view! {
        gtk::Entry {
            set_has_frame: false,
        }
    }

    fn init(_: (), root: Self::Root, _sender: ComponentSender<Self>) -> ComponentParts<Self> {
        let model = Self;
        let widgets = view_output!();
        ComponentParts { model, widgets }
    }
}
