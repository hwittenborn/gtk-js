use gtk::prelude::*;
use relm4::prelude::*;

pub struct BoxHomogeneous;

#[relm4::component(pub)]
impl SimpleComponent for BoxHomogeneous {
    type Init = ();
    type Input = ();
    type Output = ();

    view! {
        gtk::Box {
            set_orientation: gtk::Orientation::Horizontal,
            set_homogeneous: true,
            set_size_request: (200, -1),
            gtk::Label { set_label: "A" },
            gtk::Label { set_label: "B" },
            gtk::Label { set_label: "C" },
        }
    }

    fn init(_: (), root: Self::Root, _sender: ComponentSender<Self>) -> ComponentParts<Self> {
        let model = Self;
        let widgets = view_output!();
        ComponentParts { model, widgets }
    }
}
