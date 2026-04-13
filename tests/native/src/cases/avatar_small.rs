use relm4::adw;
use relm4::prelude::*;

pub struct AvatarSmall;

#[relm4::component(pub)]
impl SimpleComponent for AvatarSmall {
    type Init = ();
    type Input = ();
    type Output = ();

    view! {
        adw::Avatar {
            set_size: 24,
            set_text: Some("Alice"),
            set_show_initials: true,
        }
    }

    fn init(_: (), root: Self::Root, _sender: ComponentSender<Self>) -> ComponentParts<Self> {
        let model = Self;
        let widgets = view_output!();
        ComponentParts { model, widgets }
    }
}
