use relm4::adw;
use relm4::prelude::*;

pub struct AdwHeaderbarDefault;

#[relm4::component(pub)]
impl SimpleComponent for AdwHeaderbarDefault {
    type Init = ();
    type Input = ();
    type Output = ();

    view! {
        adw::HeaderBar {
            set_show_start_title_buttons: false,
            set_show_end_title_buttons: false,
            set_show_back_button: false,
        }
    }

    fn init(_: (), root: Self::Root, _sender: ComponentSender<Self>) -> ComponentParts<Self> {
        let model = Self;
        let widgets = view_output!();
        ComponentParts { model, widgets }
    }
}
