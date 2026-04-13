use relm4::adw;
use relm4::prelude::*;

pub struct AdwNavigationViewDefault;

#[relm4::component(pub)]
impl SimpleComponent for AdwNavigationViewDefault {
    type Init = ();
    type Input = ();
    type Output = ();

    view! {
        adw::NavigationView {}
    }

    fn init(_: (), root: Self::Root, _sender: ComponentSender<Self>) -> ComponentParts<Self> {
        let model = Self;
        let widgets = view_output!();

        let page = adw::NavigationPage::builder()
            .title("Home")
            .tag("home")
            .child(&gtk::Label::new(Some("Home Page")))
            .build();
        root.push(&page);

        ComponentParts { model, widgets }
    }
}
