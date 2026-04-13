use relm4::prelude::*;

pub struct HeaderbarStartEnd;

#[relm4::component(pub)]
impl SimpleComponent for HeaderbarStartEnd {
    type Init = ();
    type Input = ();
    type Output = ();

    view! {
        gtk::HeaderBar {
            set_show_title_buttons: false,
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
