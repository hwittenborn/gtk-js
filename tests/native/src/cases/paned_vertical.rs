use gtk::prelude::*;
use relm4::prelude::*;

pub struct PanedVertical;

#[relm4::component(pub)]
impl SimpleComponent for PanedVertical {
    type Init = ();
    type Input = ();
    type Output = ();

    view! {
        gtk::Paned {
            set_orientation: gtk::Orientation::Vertical,
            set_position: 60,
            #[wrap(Some)]
            set_start_child = &gtk::Label::builder().label("Start").build(),
            #[wrap(Some)]
            set_end_child = &gtk::Label::builder().label("End").build(),
        }
    }

    fn init(_: (), root: Self::Root, _sender: ComponentSender<Self>) -> ComponentParts<Self> {
        let model = Self;
        let widgets = view_output!();
        ComponentParts { model, widgets }
    }
}
