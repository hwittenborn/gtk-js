use relm4::adw;
use relm4::prelude::*;

pub struct SplitButtonIcon;

#[relm4::component(pub)]
impl SimpleComponent for SplitButtonIcon {
    type Init = ();
    type Input = ();
    type Output = ();

    view! {
        adw::SplitButton {
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
