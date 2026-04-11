use gtk::prelude::*;
use relm4::prelude::*;

pub struct TextViewNonEditable;

#[relm4::component(pub)]
impl SimpleComponent for TextViewNonEditable {
    type Init = ();
    type Input = ();
    type Output = ();

    view! {
        gtk::TextView {
            set_editable: false,
        }
    }

    fn init(_: (), root: Self::Root, _sender: ComponentSender<Self>) -> ComponentParts<Self> {
        let model = Self;
        let widgets = view_output!();
        ComponentParts { model, widgets }
    }
}
