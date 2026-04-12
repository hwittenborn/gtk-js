use relm4::prelude::*;

pub struct StackDefault;

#[relm4::component(pub)]
impl SimpleComponent for StackDefault {
    type Init = ();
    type Input = ();
    type Output = ();

    view! {
        gtk::Stack {
            add_titled[Some("page1"), "Page 1"] = &gtk::Label::builder().label("First").build(),
            add_titled[Some("page2"), "Page 2"] = &gtk::Label::builder().label("Second").build(),
            set_visible_child_name: "page1",
        }
    }

    fn init(_: (), root: Self::Root, _sender: ComponentSender<Self>) -> ComponentParts<Self> {
        let model = Self;
        let widgets = view_output!();
        ComponentParts { model, widgets }
    }
}
