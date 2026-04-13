use relm4::adw;
use relm4::prelude::*;

pub struct BannerWithButton;

#[relm4::component(pub)]
impl SimpleComponent for BannerWithButton {
    type Init = ();
    type Input = ();
    type Output = ();

    view! {
        adw::Banner {
            set_title: "Update available",
            set_button_label: Some("Update"),
            set_revealed: true,
        }
    }

    fn init(_: (), root: Self::Root, _sender: ComponentSender<Self>) -> ComponentParts<Self> {
        let model = Self;
        let widgets = view_output!();
        ComponentParts { model, widgets }
    }
}
