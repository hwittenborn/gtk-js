use relm4::prelude::*;

pub struct ExpanderDefault;

#[relm4::component(pub)]
impl SimpleComponent for ExpanderDefault {
    type Init = ();
    type Input = ();
    type Output = ();

    view! {
        gtk::Expander {
            set_label: Some("Expander"),
        }
    }

    fn init(_: (), root: Self::Root, _sender: ComponentSender<Self>) -> ComponentParts<Self> {
        let model = Self;
        let widgets = view_output!();
        ComponentParts { model, widgets }
    }
}
