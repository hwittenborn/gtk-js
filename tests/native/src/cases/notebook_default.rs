use relm4::prelude::*;

pub struct NotebookDefault;

#[relm4::component(pub)]
impl SimpleComponent for NotebookDefault {
    type Init = ();
    type Input = ();
    type Output = ();

    view! {
        gtk::Notebook {
            append_page[Some(&gtk::Label::new(Some("Tab 1")))] = &gtk::Label::builder().label("Page 1 content").build(),
            append_page[Some(&gtk::Label::new(Some("Tab 2")))] = &gtk::Label::builder().label("Page 2 content").build(),
        }
    }

    fn init(_: (), root: Self::Root, _sender: ComponentSender<Self>) -> ComponentParts<Self> {
        let model = Self;
        let widgets = view_output!();
        ComponentParts { model, widgets }
    }
}
