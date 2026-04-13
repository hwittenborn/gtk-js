use relm4::adw;
use relm4::adw::prelude::*;
use relm4::prelude::*;

pub struct ButtonRowDestructive;

#[relm4::component(pub)]
impl SimpleComponent for ButtonRowDestructive {
    type Init = ();
    type Input = ();
    type Output = ();

    view! {
        gtk::ListBox {
            set_selection_mode: gtk::SelectionMode::None,

            adw::ButtonRow {
                set_title: "Delete",
                add_css_class: "destructive-action",
            }
        }
    }

    fn init(_: (), root: Self::Root, _sender: ComponentSender<Self>) -> ComponentParts<Self> {
        let model = Self;
        let widgets = view_output!();
        ComponentParts { model, widgets }
    }
}
