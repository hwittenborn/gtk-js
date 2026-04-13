use relm4::adw;
use relm4::adw::prelude::*;
use relm4::prelude::*;

pub struct AdwBreakpointBinDefault;

#[relm4::component(pub)]
impl SimpleComponent for AdwBreakpointBinDefault {
    type Init = ();
    type Input = ();
    type Output = ();

    view! {
        adw::BreakpointBin {
            set_size_request: (200, 100),

            #[wrap(Some)]
            set_child = &gtk::Label {
                set_label: "Breakpoint content",
            },
        }
    }

    fn init(_: (), root: Self::Root, _sender: ComponentSender<Self>) -> ComponentParts<Self> {
        let model = Self;
        let widgets = view_output!();
        ComponentParts { model, widgets }
    }
}
