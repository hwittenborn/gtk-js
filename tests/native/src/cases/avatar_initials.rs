use relm4::adw;
use relm4::prelude::*;

pub struct AvatarInitials;

#[relm4::component(pub)]
impl SimpleComponent for AvatarInitials {
    type Init = ();
    type Input = ();
    type Output = ();

    view! {
        adw::Avatar {
            set_size: 48,
            set_text: Some("Jane Doe"),
            set_show_initials: true,
        }
    }

    fn init(_: (), root: Self::Root, _sender: ComponentSender<Self>) -> ComponentParts<Self> {
        let model = Self;
        let widgets = view_output!();
        ComponentParts { model, widgets }
    }
}
