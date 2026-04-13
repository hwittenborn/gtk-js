use relm4::adw;
use relm4::prelude::*;

pub struct StatusPageNoIcon;

#[relm4::component(pub)]
impl SimpleComponent for StatusPageNoIcon {
    type Init = ();
    type Input = ();
    type Output = ();

    view! {
        adw::StatusPage {
            set_title: "No Results",
            set_description: Some("Try a different search term"),
        }
    }

    fn init(_: (), root: Self::Root, _sender: ComponentSender<Self>) -> ComponentParts<Self> {
        let model = Self;
        let widgets = view_output!();
        ComponentParts { model, widgets }
    }
}
