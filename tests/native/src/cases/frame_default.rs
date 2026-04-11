use gtk::prelude::*;
use relm4::prelude::*;

pub struct FrameDefault;

#[relm4::component(pub)]
impl SimpleComponent for FrameDefault {
    type Init = ();
    type Input = ();
    type Output = ();

    view! {
        gtk::Frame {
            set_label: Some("Frame"),
            gtk::Label { set_label: "Content" },
        }
    }

    fn init(_: (), root: Self::Root, _sender: ComponentSender<Self>) -> ComponentParts<Self> {
        let model = Self;
        let widgets = view_output!();
        ComponentParts { model, widgets }
    }
}
