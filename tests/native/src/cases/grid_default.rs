use gtk::prelude::*;
use relm4::prelude::*;

pub struct GridDefault;

#[relm4::component(pub)]
impl SimpleComponent for GridDefault {
    type Init = ();
    type Input = ();
    type Output = ();

    view! {
        gtk::Grid {
            set_column_homogeneous: true,
            attach[0, 0, 1, 1] = &gtk::Label::builder().label("TL").build(),
            attach[1, 0, 1, 1] = &gtk::Label::builder().label("TR").build(),
            attach[0, 1, 1, 1] = &gtk::Label::builder().label("BL").build(),
            attach[1, 1, 1, 1] = &gtk::Label::builder().label("BR").build(),
        }
    }

    fn init(_: (), root: Self::Root, _sender: ComponentSender<Self>) -> ComponentParts<Self> {
        let model = Self;
        let widgets = view_output!();
        ComponentParts { model, widgets }
    }
}
