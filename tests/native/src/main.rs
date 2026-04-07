mod cases;
mod extract;

use clap::{Parser, Subcommand};
use relm4::adw;
use relm4::adw::prelude::*;
use relm4::gtk;
use relm4::prelude::*;

#[derive(Parser)]
#[command(name = "gtk-js-test")]
#[command(about = "Render GTK widgets and extract structural properties as JSON")]
struct Cli {
    #[command(subcommand)]
    command: Command,
}

#[derive(Subcommand)]
enum Command {
    ButtonTextDefault,
    ButtonTextFlat,
    ButtonTextSuggested,
    ButtonTextDestructive,
    ButtonIcon,
    ButtonCircular,
    ButtonPill,
    ButtonDisabled,
}

fn render_and_extract<C>(init: C::Init)
where
    C: SimpleComponent,
    C::Root: IsA<gtk::Widget>,
    C::Init: Copy,
{
    // Set environment before GTK init for deterministic rendering
    unsafe {
        std::env::set_var("GDK_SCALE", "1");
    }

    let app = adw::Application::builder()
        .application_id("org.gtkjs.test")
        .build();

    app.connect_activate(move |app| {
        let settings = gtk::Settings::default().expect("Failed to get GtkSettings");
        settings.set_gtk_font_name(Some("Cantarell 11"));
        // Force Adwaita style manager to light mode
        let style_manager = adw::StyleManager::default();
        style_manager.set_color_scheme(adw::ColorScheme::ForceLight);

        let window = adw::Window::builder()
            .application(app)
            .decorated(false)
            .default_width(200)
            .default_height(100)
            .build();

        let component = C::builder().launch(init).detach();

        let widget = component.widget().clone();
        window.set_content(Some(&widget));
        window.present();

        gtk::glib::idle_add_local_once(move || {
            let widget_width = widget.width();
            let widget_height = widget.height();

            if widget_width <= 0 || widget_height <= 0 {
                eprintln!("Widget has zero size, layout may not have completed");
                std::process::exit(1);
            }

            // Snapshot the widget at its natural size
            let paintable = gtk::WidgetPaintable::new(Some(&widget));
            let snapshot = gtk::Snapshot::new();
            paintable.snapshot(
                &snapshot,
                widget_width as f64,
                widget_height as f64,
            );

            if let Some(node) = snapshot.to_node() {
                let result = extract::extract_with_widget(&node, &widget);
                let json =
                    serde_json::to_string_pretty(&result).expect("Failed to serialize snapshot");
                println!("{json}");
            } else {
                eprintln!("No render node produced");
                std::process::exit(1);
            }

            window.close();
            std::process::exit(0);
        });
    });

    app.run_with_args::<&str>(&[]);
}

fn main() {
    let cli = Cli::parse();

    match cli.command {
        Command::ButtonTextDefault => {
            render_and_extract::<cases::button_text_default::ButtonTextDefault>(())
        }
        Command::ButtonTextFlat => {
            render_and_extract::<cases::button_text_flat::ButtonTextFlat>(())
        }
        Command::ButtonTextSuggested => {
            render_and_extract::<cases::button_text_suggested::ButtonTextSuggested>(())
        }
        Command::ButtonTextDestructive => {
            render_and_extract::<cases::button_text_destructive::ButtonTextDestructive>(())
        }
        Command::ButtonIcon => render_and_extract::<cases::button_icon::ButtonIcon>(()),
        Command::ButtonCircular => render_and_extract::<cases::button_circular::ButtonCircular>(()),
        Command::ButtonPill => render_and_extract::<cases::button_pill::ButtonPill>(()),
        Command::ButtonDisabled => render_and_extract::<cases::button_disabled::ButtonDisabled>(()),
    }
}
