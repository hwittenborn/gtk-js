use relm4::prelude::*;

pub struct SearchEntryDefault;

#[relm4::component(pub)]
impl SimpleComponent for SearchEntryDefault {
    type Init = ();
    type Input = ();
    type Output = ();

    view! {
        gtk::SearchEntry { }
    }

    fn init(_: (), root: Self::Root, _sender: ComponentSender<Self>) -> ComponentParts<Self> {
        let model = Self;
        let widgets = view_output!();
        ComponentParts { model, widgets }
    }
}
