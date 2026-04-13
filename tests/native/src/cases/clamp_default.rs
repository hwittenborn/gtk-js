use relm4::adw;
use relm4::prelude::*;

pub struct ClampDefault;

#[relm4::component(pub)]
impl SimpleComponent for ClampDefault {
    type Init = ();
    type Input = ();
    type Output = ();

    view! {
        adw::Clamp {
            set_maximum_size: 600,
            set_tightening_threshold: 400,

            gtk::Label {
                set_label: "Clamped content",
            },
        }
    }

    fn init(_: (), root: Self::Root, _sender: ComponentSender<Self>) -> ComponentParts<Self> {
        let model = Self;
        let widgets = view_output!();
        ComponentParts { model, widgets }
    }
}
