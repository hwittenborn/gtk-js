use gtk::prelude::*;
use relm4::prelude::*;

pub struct ButtonValignCenterHbox;

#[relm4::component(pub)]
impl SimpleComponent for ButtonValignCenterHbox {
    type Init = ();
    type Input = ();
    type Output = ();

    view! {
        gtk::Box {
            set_orientation: gtk::Orientation::Horizontal,
            gtk::Button {
                set_label: "Button",
                set_valign: gtk::Align::Center,
            },
        }
    }

    fn init(_: (), root: Self::Root, _sender: ComponentSender<Self>) -> ComponentParts<Self> {
        let model = Self;
        let widgets = view_output!();
        ComponentParts { model, widgets }
    }
}
