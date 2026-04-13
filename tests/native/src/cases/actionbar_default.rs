use relm4::prelude::*;

pub struct ActionbarDefault;

#[relm4::component(pub)]
impl SimpleComponent for ActionbarDefault {
    type Init = ();
    type Input = ();
    type Output = ();

    view! {
        gtk::ActionBar {
            pack_start = &gtk::Button::with_label("Action") {},
            pack_end = &gtk::Button::with_label("Done") {},
        }
    }

    fn init(_: (), root: Self::Root, _sender: ComponentSender<Self>) -> ComponentParts<Self> {
        let model = Self;
        let widgets = view_output!();
        ComponentParts { model, widgets }
    }
}
