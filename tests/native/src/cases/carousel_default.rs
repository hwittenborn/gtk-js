use relm4::adw;
use relm4::prelude::*;

pub struct CarouselDefault;

#[relm4::component(pub)]
impl SimpleComponent for CarouselDefault {
    type Init = ();
    type Input = ();
    type Output = ();

    view! {
        adw::Carousel {
            set_interactive: true,
        }
    }

    fn init(_: (), root: Self::Root, _sender: ComponentSender<Self>) -> ComponentParts<Self> {
        let model = Self;
        let widgets = view_output!();

        let page1 = gtk::Label::new(Some("Page 1"));
        let page2 = gtk::Label::new(Some("Page 2"));
        let page3 = gtk::Label::new(Some("Page 3"));
        root.append(&page1);
        root.append(&page2);
        root.append(&page3);

        ComponentParts { model, widgets }
    }
}
