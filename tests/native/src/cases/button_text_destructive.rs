use gtk::prelude::*;
use relm4::prelude::*;

pub struct ButtonTextDestructive;

#[relm4::component(pub)]
impl SimpleComponent for ButtonTextDestructive {
    type Init = ();
    type Input = ();
    type Output = ();

    view! {
        gtk::Button {
            set_label: "Button",
            add_css_class: "destructive-action",
        }
    }

    fn init(_: (), root: Self::Root, _sender: ComponentSender<Self>) -> ComponentParts<Self> {
        let model = Self;
        let widgets = view_output!();
        ComponentParts { model, widgets }
    }
}
