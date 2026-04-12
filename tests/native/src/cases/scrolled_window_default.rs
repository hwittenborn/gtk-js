use gtk::prelude::*;
use relm4::prelude::*;

pub struct ScrolledWindowDefault;

#[relm4::component(pub)]
impl SimpleComponent for ScrolledWindowDefault {
    type Init = ();
    type Input = ();
    type Output = ();

    view! {
        gtk::ScrolledWindow {
            set_width_request: 200,
            set_height_request: 150,
            gtk::Label { set_label: "Scrollable content" },
        }
    }

    fn init(_: (), root: Self::Root, _sender: ComponentSender<Self>) -> ComponentParts<Self> {
        let model = Self;
        let widgets = view_output!();
        ComponentParts { model, widgets }
    }
}
