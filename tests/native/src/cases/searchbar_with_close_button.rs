use relm4::prelude::*;

pub struct SearchbarWithCloseButton;

#[relm4::component(pub)]
impl SimpleComponent for SearchbarWithCloseButton {
    type Init = ();
    type Input = ();
    type Output = ();

    view! {
        gtk::SearchBar {
            set_search_mode: true,
            set_show_close_button: true,
            set_child: Some(&gtk::SearchEntry::new()),
        }
    }

    fn init(_: (), root: Self::Root, _sender: ComponentSender<Self>) -> ComponentParts<Self> {
        let model = Self;
        let widgets = view_output!();
        ComponentParts { model, widgets }
    }
}
