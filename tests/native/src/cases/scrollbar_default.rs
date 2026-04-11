use relm4::prelude::*;

pub struct ScrollbarDefault;

#[relm4::component(pub)]
impl SimpleComponent for ScrollbarDefault {
    type Init = ();
    type Input = ();
    type Output = ();

    view! {
        gtk::Scrollbar::new(
            gtk::Orientation::Vertical,
            Some(&gtk::Adjustment::new(0.0, 0.0, 1.0, 0.01, 0.1, 0.2))
        ) {}
    }

    fn init(_: (), root: Self::Root, _sender: ComponentSender<Self>) -> ComponentParts<Self> {
        let model = Self;
        let widgets = view_output!();
        ComponentParts { model, widgets }
    }
}
