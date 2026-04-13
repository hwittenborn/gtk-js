use relm4::adw;
use relm4::adw::prelude::*;
use relm4::prelude::*;

pub struct AdwPreferencesGroupDefault;

#[relm4::component(pub)]
impl SimpleComponent for AdwPreferencesGroupDefault {
    type Init = ();
    type Input = ();
    type Output = ();

    view! {
        adw::PreferencesGroup {
            set_title: "Group Title",

            adw::ActionRow {
                set_title: "Row 1",
            },
            adw::ActionRow {
                set_title: "Row 2",
            },
        }
    }

    fn init(_: (), root: Self::Root, _sender: ComponentSender<Self>) -> ComponentParts<Self> {
        let model = Self;
        let widgets = view_output!();
        ComponentParts { model, widgets }
    }
}
