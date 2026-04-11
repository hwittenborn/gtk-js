use gtk::prelude::*;
use relm4::prelude::*;

pub struct CenterBoxDefault;

#[relm4::component(pub)]
impl SimpleComponent for CenterBoxDefault {
    type Init = ();
    type Input = ();
    type Output = ();

    view! {
        gtk::CenterBox {
            set_size_request: (300, -1),
            #[wrap(Some)]
            set_start_widget = &gtk::Label::builder().label("Start").build(),
            #[wrap(Some)]
            set_center_widget = &gtk::Label::builder().label("Center").build(),
            #[wrap(Some)]
            set_end_widget = &gtk::Label::builder().label("End").build(),
        }
    }

    fn init(_: (), root: Self::Root, _sender: ComponentSender<Self>) -> ComponentParts<Self> {
        let model = Self;
        let widgets = view_output!();
        ComponentParts { model, widgets }
    }
}
