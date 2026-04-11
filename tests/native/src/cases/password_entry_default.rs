use relm4::prelude::*;

pub struct PasswordEntryDefault;

#[relm4::component(pub)]
impl SimpleComponent for PasswordEntryDefault {
    type Init = ();
    type Input = ();
    type Output = ();

    view! {
        gtk::PasswordEntry { }
    }

    fn init(_: (), root: Self::Root, _sender: ComponentSender<Self>) -> ComponentParts<Self> {
        let model = Self;
        let widgets = view_output!();
        ComponentParts { model, widgets }
    }
}
