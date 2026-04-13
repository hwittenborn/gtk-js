use relm4::adw;
use relm4::prelude::*;

pub struct ToastOverlayDefault;

#[relm4::component(pub)]
impl SimpleComponent for ToastOverlayDefault {
    type Init = ();
    type Input = ();
    type Output = ();

    view! {
        adw::ToastOverlay {
            gtk::Label {
                set_label: "Content under toasts",
            },
        }
    }

    fn init(_: (), root: Self::Root, _sender: ComponentSender<Self>) -> ComponentParts<Self> {
        let model = Self;
        let widgets = view_output!();
        ComponentParts { model, widgets }
    }
}
