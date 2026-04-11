use gtk::prelude::*;
use relm4::prelude::*;

pub struct OverlayDefault;

#[relm4::component(pub)]
impl SimpleComponent for OverlayDefault {
    type Init = ();
    type Input = ();
    type Output = ();

    view! {
        gtk::Overlay {
            set_size_request: (200, 100),
            set_child: Some(&gtk::Label::builder().label("Base").build()),
            add_overlay: &gtk::Label::builder().label("Overlay").build(),
        }
    }

    fn init(_: (), root: Self::Root, _sender: ComponentSender<Self>) -> ComponentParts<Self> {
        let model = Self;
        let widgets = view_output!();
        ComponentParts { model, widgets }
    }
}
