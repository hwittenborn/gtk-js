use relm4::adw;
use relm4::prelude::*;

pub struct AdwHeaderbarStartEnd;

#[relm4::component(pub)]
impl SimpleComponent for AdwHeaderbarStartEnd {
    type Init = ();
    type Input = ();
    type Output = ();

    view! {
        adw::HeaderBar {
            set_show_start_title_buttons: false,
            set_show_end_title_buttons: false,
            set_show_back_button: false,
            pack_start = &gtk::Button::with_label("Start") {},
            pack_end = &gtk::Button::with_label("End") {},
        }
    }

    fn init(_: (), root: Self::Root, _sender: ComponentSender<Self>) -> ComponentParts<Self> {
        let model = Self;
        let widgets = view_output!();
        ComponentParts { model, widgets }
    }
}
