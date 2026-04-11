use gtk::prelude::*;
use relm4::prelude::*;

pub struct SearchEntryDisabled;

#[relm4::component(pub)]
impl SimpleComponent for SearchEntryDisabled {
    type Init = ();
    type Input = ();
    type Output = ();

    view! {
        gtk::SearchEntry {
            set_sensitive: false,
        }
    }

    fn init(_: (), root: Self::Root, _sender: ComponentSender<Self>) -> ComponentParts<Self> {
        let model = Self;
        let widgets = view_output!();
        ComponentParts { model, widgets }
    }
}
