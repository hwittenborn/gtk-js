use relm4::prelude::*;

pub struct MenuButtonTextDefault;

#[relm4::component(pub)]
impl SimpleComponent for MenuButtonTextDefault {
    type Init = ();
    type Input = ();
    type Output = ();

    view! {
        gtk::MenuButton {
            set_label: "Button",
            set_popover: Some(&gtk::Popover::new()),
        }
    }

    fn init(_: (), root: Self::Root, _sender: ComponentSender<Self>) -> ComponentParts<Self> {
        let model = Self;
        let widgets = view_output!();
        ComponentParts { model, widgets }
    }
}
