use gtk::prelude::*;
use relm4::prelude::*;

pub struct MenuButtonCircular;

#[relm4::component(pub)]
impl SimpleComponent for MenuButtonCircular {
    type Init = ();
    type Input = ();
    type Output = ();

    view! {
        gtk::MenuButton {
            set_popover: Some(&gtk::Popover::new()),
            add_css_class: "circular",
        }
    }

    fn init(_: (), root: Self::Root, _sender: ComponentSender<Self>) -> ComponentParts<Self> {
        let model = Self;
        let widgets = view_output!();
        ComponentParts { model, widgets }
    }
}
