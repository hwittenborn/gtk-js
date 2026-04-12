use relm4::prelude::*;

pub struct ListboxSeparators;

#[relm4::component(pub)]
impl SimpleComponent for ListboxSeparators {
    type Init = ();
    type Input = ();
    type Output = ();

    view! {
        gtk::ListBox {
            set_selection_mode: gtk::SelectionMode::None,
            set_show_separators: true,
            gtk::ListBoxRow {
                gtk::Label { set_label: "Row 1" },
            },
            gtk::ListBoxRow {
                gtk::Label { set_label: "Row 2" },
            },
            gtk::ListBoxRow {
                gtk::Label { set_label: "Row 3" },
            },
        }
    }

    fn init(_: (), root: Self::Root, _sender: ComponentSender<Self>) -> ComponentParts<Self> {
        let model = Self;
        let widgets = view_output!();
        ComponentParts { model, widgets }
    }
}
