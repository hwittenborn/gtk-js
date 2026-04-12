use relm4::prelude::*;

pub struct HeaderbarDefault;

#[relm4::component(pub)]
impl SimpleComponent for HeaderbarDefault {
    type Init = ();
    type Input = ();
    type Output = ();

    view! {
        gtk::HeaderBar {
            set_show_title_buttons: false,
        }
    }

    fn init(_: (), root: Self::Root, _sender: ComponentSender<Self>) -> ComponentParts<Self> {
        let model = Self;
        let widgets = view_output!();
        ComponentParts { model, widgets }
    }
}
