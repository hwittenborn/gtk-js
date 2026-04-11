use relm4::prelude::*;

pub struct TextViewDefault;

#[relm4::component(pub)]
impl SimpleComponent for TextViewDefault {
    type Init = ();
    type Input = ();
    type Output = ();

    view! {
        gtk::TextView { }
    }

    fn init(_: (), root: Self::Root, _sender: ComponentSender<Self>) -> ComponentParts<Self> {
        let model = Self;
        let widgets = view_output!();
        ComponentParts { model, widgets }
    }
}
