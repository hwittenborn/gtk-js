use relm4::adw;
use relm4::prelude::*;

pub struct AdwHeaderbarWithTitle;

#[relm4::component(pub)]
impl SimpleComponent for AdwHeaderbarWithTitle {
    type Init = ();
    type Input = ();
    type Output = ();

    view! {
        adw::HeaderBar {
            set_show_start_title_buttons: false,
            set_show_end_title_buttons: false,
            set_show_back_button: false,
            #[wrap(Some)]
            set_title_widget = &adw::WindowTitle::builder().title("Header Title").build(),
        }
    }

    fn init(_: (), root: Self::Root, _sender: ComponentSender<Self>) -> ComponentParts<Self> {
        let model = Self;
        let widgets = view_output!();
        ComponentParts { model, widgets }
    }
}
