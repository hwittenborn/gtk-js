use relm4::adw;
use relm4::prelude::*;

pub struct AdwToolbarViewWithBottom;

#[relm4::component(pub)]
impl SimpleComponent for AdwToolbarViewWithBottom {
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

            add_bottom_bar = &gtk::ActionBar {
                pack_start = &gtk::Button::with_label("Action") {},
            },
        }
    }

    fn init(_: (), root: Self::Root, _sender: ComponentSender<Self>) -> ComponentParts<Self> {
        let model = Self;
        let widgets = view_output!();
        ComponentParts { model, widgets }
    }
}
