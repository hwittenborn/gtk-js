use relm4::adw;
use relm4::adw::prelude::*;
use relm4::prelude::*;

pub struct AdwPreferencesPageDefault;

#[relm4::component(pub)]
impl SimpleComponent for AdwPreferencesPageDefault {
    type Init = ();
    type Input = ();
    type Output = ();

    view! {
        adw::PreferencesPage {
            adw::PreferencesGroup {
                set_title: "General",

                adw::ActionRow {
                    set_title: "Setting 1",
                },
                adw::ActionRow {
                    set_title: "Setting 2",
                },
            },
        }
    }

    fn init(_: (), root: Self::Root, _sender: ComponentSender<Self>) -> ComponentParts<Self> {
        let model = Self;
        let widgets = view_output!();
        ComponentParts { model, widgets }
    }
}
