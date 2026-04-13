use relm4::adw;
use relm4::prelude::*;

pub struct AvatarDefault;

#[relm4::component(pub)]
impl SimpleComponent for AvatarDefault {
    type Init = ();
    type Input = ();
    type Output = ();

    view! {
        adw::Avatar {
            set_size: 48,
            set_text: Some(""),
            set_show_initials: false,
        }
    }

    fn init(_: (), root: Self::Root, _sender: ComponentSender<Self>) -> ComponentParts<Self> {
        let model = Self;
        let widgets = view_output!();
        ComponentParts { model, widgets }
    }
}
