use gtk::prelude::*;
use relm4::prelude::*;

pub struct ExpanderExpanded;

#[relm4::component(pub)]
impl SimpleComponent for ExpanderExpanded {
    type Init = ();
    type Input = ();
    type Output = ();

    view! {
        gtk::Expander {
            set_label: Some("Expander"),
            set_expanded: true,
            gtk::Label { set_label: "Content" },
        }
    }

    fn init(_: (), root: Self::Root, _sender: ComponentSender<Self>) -> ComponentParts<Self> {
        let model = Self;
        let widgets = view_output!();
        ComponentParts { model, widgets }
    }
}
