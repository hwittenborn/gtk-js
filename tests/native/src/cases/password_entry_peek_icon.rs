use relm4::prelude::*;

pub struct PasswordEntryPeekIcon;

#[relm4::component(pub)]
impl SimpleComponent for PasswordEntryPeekIcon {
    type Init = ();
    type Input = ();
    type Output = ();

    view! {
        gtk::PasswordEntry {
            set_show_peek_icon: true,
        }
    }

    fn init(_: (), root: Self::Root, _sender: ComponentSender<Self>) -> ComponentParts<Self> {
        let model = Self;
        let widgets = view_output!();
        ComponentParts { model, widgets }
    }
}
