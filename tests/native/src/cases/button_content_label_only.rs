use relm4::adw;
use relm4::prelude::*;

pub struct ButtonContentLabelOnly;

#[relm4::component(pub)]
impl SimpleComponent for ButtonContentLabelOnly {
    type Init = ();
    type Input = ();
    type Output = ();

    view! {
        adw::ButtonContent {
            set_label: "Open",
        }
    }

    fn init(_: (), root: Self::Root, _sender: ComponentSender<Self>) -> ComponentParts<Self> {
        let model = Self;
        let widgets = view_output!();
        ComponentParts { model, widgets }
    }
}
