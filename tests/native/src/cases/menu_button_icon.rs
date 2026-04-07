use relm4::prelude::*;

pub struct MenuButtonIcon;

#[relm4::component(pub)]
impl SimpleComponent for MenuButtonIcon {
    type Init = ();
    type Input = ();
    type Output = ();

    view! {
        gtk::MenuButton {
            set_icon_name: "open-menu-symbolic",
            set_popover: Some(&gtk::Popover::new()),
        }
    }

    fn init(_: (), root: Self::Root, _sender: ComponentSender<Self>) -> ComponentParts<Self> {
        let model = Self;
        let widgets = view_output!();
        ComponentParts { model, widgets }
    }
}
