use relm4::adw;
use relm4::prelude::*;

pub struct AdwOverlaySplitViewDefault;

#[relm4::component(pub)]
impl SimpleComponent for AdwOverlaySplitViewDefault {
    type Init = ();
    type Input = ();
    type Output = ();

    view! {
        adw::OverlaySplitView {
            set_collapsed: false,
            set_show_sidebar: true,

            #[wrap(Some)]
            set_sidebar = &gtk::Label {
                set_label: "Sidebar",
            },

            #[wrap(Some)]
            set_content = &gtk::Label {
                set_label: "Content",
            },
        }
    }

    fn init(_: (), root: Self::Root, _sender: ComponentSender<Self>) -> ComponentParts<Self> {
        let model = Self;
        let widgets = view_output!();
        ComponentParts { model, widgets }
    }
}
