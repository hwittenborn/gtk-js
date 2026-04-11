use relm4::prelude::*;

pub struct FlowBoxDefault;

#[relm4::component(pub)]
impl SimpleComponent for FlowBoxDefault {
    type Init = ();
    type Input = ();
    type Output = ();

    view! {
        gtk::FlowBox {
            set_selection_mode: gtk::SelectionMode::None,
            gtk::FlowBoxChild {
                gtk::Label { set_label: "One" },
            },
            gtk::FlowBoxChild {
                gtk::Label { set_label: "Two" },
            },
            gtk::FlowBoxChild {
                gtk::Label { set_label: "Three" },
            },
            gtk::FlowBoxChild {
                gtk::Label { set_label: "Four" },
            },
        }
    }

    fn init(_: (), root: Self::Root, _sender: ComponentSender<Self>) -> ComponentParts<Self> {
        let model = Self;
        let widgets = view_output!();
        ComponentParts { model, widgets }
    }
}
