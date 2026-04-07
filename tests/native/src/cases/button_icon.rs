use gtk::prelude::*;
use relm4::prelude::*;

pub struct ButtonIcon;

#[relm4::component(pub)]
impl SimpleComponent for ButtonIcon {
    type Init = ();
    type Input = ();
    type Output = ();

    view! {
        gtk::Button {
            set_icon_name: "open-menu-symbolic",
        }
    }

    fn init(_: (), root: Self::Root, _sender: ComponentSender<Self>) -> ComponentParts<Self> {
        let model = Self;
        let widgets = view_output!();
        ComponentParts { model, widgets }
    }
}
