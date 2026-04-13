use gtk::prelude::*;
use relm4::adw;
use relm4::prelude::*;

pub struct SplitButtonFlat;

#[relm4::component(pub)]
impl SimpleComponent for SplitButtonFlat {
    type Init = ();
    type Input = ();
    type Output = ();

    view! {
        adw::SplitButton {
            set_label: "Button",
            set_popover: Some(&gtk::Popover::new()),
            add_css_class: "flat",
        }
    }

    fn init(_: (), root: Self::Root, _sender: ComponentSender<Self>) -> ComponentParts<Self> {
        let model = Self;
        let widgets = view_output!();
        ComponentParts { model, widgets }
    }
}
