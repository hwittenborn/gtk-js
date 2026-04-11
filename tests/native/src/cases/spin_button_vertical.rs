use gtk::prelude::*;
use relm4::prelude::*;

pub struct SpinButtonVertical;

#[relm4::component(pub)]
impl SimpleComponent for SpinButtonVertical {
    type Init = ();
    type Input = ();
    type Output = ();

    view! {
        gtk::SpinButton::with_range(0.0, 100.0, 1.0) {
            set_value: 50.0,
            set_orientation: gtk::Orientation::Vertical,
        }
    }

    fn init(_: (), root: Self::Root, _sender: ComponentSender<Self>) -> ComponentParts<Self> {
        let model = Self;
        let widgets = view_output!();
        ComponentParts { model, widgets }
    }
}
