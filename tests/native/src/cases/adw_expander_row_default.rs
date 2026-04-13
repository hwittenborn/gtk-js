use relm4::adw;
use relm4::adw::prelude::*;
use relm4::prelude::*;

pub struct AdwExpanderRowDefault;

#[relm4::component(pub)]
impl SimpleComponent for AdwExpanderRowDefault {
    type Init = ();
    type Input = ();
    type Output = ();

    view! {
        gtk::ListBox {
            set_selection_mode: gtk::SelectionMode::None,
            add_css_class: "boxed-list",

            adw::ExpanderRow {
                set_title: "Expander Row",
            },
        }
    }

    fn init(_: (), root: Self::Root, _sender: ComponentSender<Self>) -> ComponentParts<Self> {
        let model = Self;
        let widgets = view_output!();

        if let Some(row) = root
            .first_child()
            .and_then(|w| w.downcast::<adw::ExpanderRow>().ok())
        {
            let child1 = adw::ActionRow::builder().title("Child Row 1").build();
            let child2 = adw::ActionRow::builder().title("Child Row 2").build();
            row.add_row(&child1);
            row.add_row(&child2);
        }

        ComponentParts { model, widgets }
    }
}
