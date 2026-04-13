use relm4::adw;
use relm4::prelude::*;

pub struct StatusPageDefault;

#[relm4::component(pub)]
impl SimpleComponent for StatusPageDefault {
    type Init = ();
    type Input = ();
    type Output = ();

    view! {
        adw::StatusPage {
            set_icon_name: Some("dialog-information-symbolic"),
            set_title: "Nothing Here",
            set_description: Some("There are no items to display"),
        }
    }

    fn init(_: (), root: Self::Root, _sender: ComponentSender<Self>) -> ComponentParts<Self> {
        let model = Self;
        let widgets = view_output!();
        ComponentParts { model, widgets }
    }
}
