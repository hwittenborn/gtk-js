use relm4::adw;
use relm4::prelude::*;

pub struct AdwToolbarViewDefault;

#[relm4::component(pub)]
impl SimpleComponent for AdwToolbarViewDefault {
    type Init = ();
    type Input = ();
    type Output = ();

    view! {
        adw::ToolbarView {
            add_top_bar = &adw::HeaderBar {
                set_show_start_title_buttons: false,
                set_show_end_title_buttons: false,
                set_show_back_button: false,
            },

            #[wrap(Some)]
            set_content = &gtk::Label {
                set_label: "Content",
            },
        }
    }

    fn init(_: (), root: Self::Root, _sender: ComponentSender<Self>) -> ComponentParts<Self> {
        let model = Self;
        let widgets = view_output!();
        ComponentParts { model, widgets }
    }
}
