use relm4::prelude::*;

pub struct SearchbarDefault;

#[relm4::component(pub)]
impl SimpleComponent for SearchbarDefault {
    type Init = ();
    type Input = ();
    type Output = ();

    view! {
        gtk::SearchBar {
            set_search_mode: true,
            set_child: Some(&gtk::SearchEntry::new()),
        }
    }

    fn init(_: (), root: Self::Root, _sender: ComponentSender<Self>) -> ComponentParts<Self> {
        let model = Self;
        let widgets = view_output!();
        ComponentParts { model, widgets }
    }
}
