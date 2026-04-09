mod cases;
mod extract;

use std::io::Write;
use std::path::PathBuf;
use std::sync::atomic::{AtomicBool, Ordering};
use std::sync::mpsc;
use std::sync::{Arc, Mutex};
use std::thread;
use std::time::Duration;

use axum::Router;
use axum::extract::{Path, State};
use axum::http::StatusCode;
use axum::routing::get;
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

    /// Write JSON output to this file instead of stdout
    #[arg(long)]
    output: Option<PathBuf>,
}

#[derive(Subcommand)]
enum Command {
    Serve {
        #[arg(long)]
        port_file: Option<PathBuf>,
    },
    ButtonTextDefault,
    ButtonTextFlat,
    ButtonTextSuggested,
    ButtonTextDestructive,
    ButtonIcon,
    ButtonCircular,
    ButtonPill,
    ButtonDisabled,
    LinkDefault,
    LinkVisited,
    MenuButtonTextDefault,
    MenuButtonIcon,
    MenuButtonFlat,
    MenuButtonCircular,
    MenuButtonDisabled,
    ToggleTextDefault,
    ToggleTextChecked,
    ToggleTextFlat,
    ToggleDisabled,
}

struct NativeRequest {
    case_name: String,
    response: mpsc::SyncSender<Result<String, String>>,
}

#[derive(Clone)]
struct ServerState {
    sender: mpsc::Sender<NativeRequest>,
    ready: Arc<AtomicBool>,
}

fn debug_enabled() -> bool {
    std::env::var_os("GTK_JS_TEST_DEBUG").is_some()
}

fn debug_log(message: impl AsRef<str>) {
    if debug_enabled() {
        eprintln!("[native] {}", message.as_ref());
    }
}

macro_rules! widget_case {
    ($component:path, $use_inner:expr) => {{
        let component = <$component>::builder().launch(()).detach();
        Some((
            component.widget().clone().upcast::<gtk::Widget>(),
            $use_inner,
        ))
    }};
}

impl Command {
    fn case_name(&self) -> Option<&'static str> {
        match self {
            Self::Serve { .. } => None,
            Self::ButtonTextDefault => Some("button-text-default"),
            Self::ButtonTextFlat => Some("button-text-flat"),
            Self::ButtonTextSuggested => Some("button-text-suggested"),
            Self::ButtonTextDestructive => Some("button-text-destructive"),
            Self::ButtonIcon => Some("button-icon"),
            Self::ButtonCircular => Some("button-circular"),
            Self::ButtonPill => Some("button-pill"),
            Self::ButtonDisabled => Some("button-disabled"),
            Self::LinkDefault => Some("link-default"),
            Self::LinkVisited => Some("link-visited"),
            Self::MenuButtonTextDefault => Some("menu-button-text-default"),
            Self::MenuButtonIcon => Some("menu-button-icon"),
            Self::MenuButtonFlat => Some("menu-button-flat"),
            Self::MenuButtonCircular => Some("menu-button-circular"),
            Self::MenuButtonDisabled => Some("menu-button-disabled"),
            Self::ToggleTextDefault => Some("toggle-text-default"),
            Self::ToggleTextChecked => Some("toggle-text-checked"),
            Self::ToggleTextFlat => Some("toggle-text-flat"),
            Self::ToggleDisabled => Some("toggle-disabled"),
        }
    }
}

fn create_widget_for_case(name: &str) -> Option<(gtk::Widget, bool)> {
    match name {
        "button-text-default" => widget_case!(cases::button_text_default::ButtonTextDefault, false),
        "button-text-flat" => widget_case!(cases::button_text_flat::ButtonTextFlat, false),
        "button-text-suggested" => {
            widget_case!(cases::button_text_suggested::ButtonTextSuggested, false)
        }
        "button-text-destructive" => {
            widget_case!(cases::button_text_destructive::ButtonTextDestructive, false)
        }
        "button-icon" => widget_case!(cases::button_icon::ButtonIcon, false),
        "button-circular" => widget_case!(cases::button_circular::ButtonCircular, false),
        "button-pill" => widget_case!(cases::button_pill::ButtonPill, false),
        "button-disabled" => widget_case!(cases::button_disabled::ButtonDisabled, false),
        "link-default" => widget_case!(cases::link_default::LinkDefault, false),
        "link-visited" => widget_case!(cases::link_visited::LinkVisited, false),
        "menu-button-text-default" => {
            widget_case!(cases::menu_button_text_default::MenuButtonTextDefault, true)
        }
        "menu-button-icon" => widget_case!(cases::menu_button_icon::MenuButtonIcon, true),
        "menu-button-flat" => widget_case!(cases::menu_button_flat::MenuButtonFlat, true),
        "menu-button-circular" => {
            widget_case!(cases::menu_button_circular::MenuButtonCircular, true)
        }
        "menu-button-disabled" => {
            widget_case!(cases::menu_button_disabled::MenuButtonDisabled, true)
        }
        "toggle-text-default" => widget_case!(cases::toggle_text_default::ToggleTextDefault, false),
        "toggle-text-checked" => widget_case!(cases::toggle_text_checked::ToggleTextChecked, false),
        "toggle-text-flat" => widget_case!(cases::toggle_text_flat::ToggleTextFlat, false),
        "toggle-disabled" => widget_case!(cases::toggle_disabled::ToggleDisabled, false),
        _ => None,
    }
}

fn is_known_case(name: &str) -> bool {
    matches!(
        name,
        "button-text-default"
            | "button-text-flat"
            | "button-text-suggested"
            | "button-text-destructive"
            | "button-icon"
            | "button-circular"
            | "button-pill"
            | "button-disabled"
            | "link-default"
            | "link-visited"
            | "menu-button-text-default"
            | "menu-button-icon"
            | "menu-button-flat"
            | "menu-button-circular"
            | "menu-button-disabled"
            | "toggle-text-default"
            | "toggle-text-checked"
            | "toggle-text-flat"
            | "toggle-disabled"
    )
}

fn configure_environment() {
    unsafe {
        std::env::set_var("GDK_SCALE", "1");
    }
}

fn configure_rendering() {
    let settings = gtk::Settings::default().expect("Failed to get GtkSettings");
    settings.set_gtk_font_name(Some("Cantarell 11"));

    let style_manager = adw::StyleManager::default();
    style_manager.set_color_scheme(adw::ColorScheme::ForceLight);
}

fn render_snapshot_json(widget: &gtk::Widget, use_inner: bool) -> Result<String, String> {
    let target = if use_inner {
        widget
            .first_child()
            .ok_or_else(|| "render_and_extract_inner: widget has no first child".to_string())?
    } else {
        widget.clone()
    };

    let target_width = target.width();
    let target_height = target.height();

    if target_width <= 0 || target_height <= 0 {
        let label = if use_inner { "Inner widget" } else { "Widget" };
        return Err(format!(
            "{label} has zero size, layout may not have completed"
        ));
    }

    let paintable = gtk::WidgetPaintable::new(Some(&target));
    let snapshot = gtk::Snapshot::new();
    paintable.snapshot(&snapshot, target_width as f64, target_height as f64);

    let node = snapshot
        .to_node()
        .ok_or_else(|| "No render node produced".to_string())?;
    let result = extract::extract_with_widget(&node, &target);

    serde_json::to_string_pretty(&result).map_err(|err| err.to_string())
}

fn render_widget(
    app: Option<&adw::Application>,
    widget: gtk::Widget,
    use_inner: bool,
    on_complete: impl FnOnce(Result<String, String>) + 'static,
) {
    let window = adw::Window::builder()
        .decorated(false)
        .default_width(200)
        .default_height(100)
        .build();
    if let Some(app) = app {
        window.set_application(Some(app));
    }

    window.set_content(Some(&widget));
    window.present();

    gtk::glib::idle_add_local_once(move || {
        let result = render_snapshot_json(&widget, use_inner);
        on_complete(result);
        window.close();
    });
}

fn run_single_snapshot(case_name: &'static str, output: Option<PathBuf>) {
    configure_environment();
    let app = adw::Application::builder()
        .application_id("org.gtkjs.test")
        .build();

    app.connect_activate(move |app| {
        configure_rendering();

        let Some((widget, use_inner)) = create_widget_for_case(case_name) else {
            eprintln!("Unknown case: {case_name}");
            app.quit();
            return;
        };

        let output = output.clone();
        let app = app.clone();
        let quit_app = app.clone();
        render_widget(Some(app.as_ref()), widget, use_inner, move |result| {
            match result {
                Ok(json) => {
                    if let Some(ref path) = output {
                        if let Err(err) = std::fs::write(path, &json) {
                            eprintln!("Failed to write output file: {err}");
                        }
                    } else {
                        println!("{json}");
                    }
                }
                Err(err) => eprintln!("{err}"),
            }

            quit_app.quit();
        });
    });

    app.run_with_args::<&str>(&[]);
}

fn handle_snapshot_request(request: NativeRequest) {
    debug_log(format!("received request for {}", request.case_name));
    let Some((widget, use_inner)) = create_widget_for_case(&request.case_name) else {
        let _ = request
            .response
            .send(Err(format!("Unknown case: {}", request.case_name)));
        return;
    };

    render_widget(None, widget, use_inner, move |result| {
        debug_log("completed request");
        let _ = request.response.send(result);
    });
}

async fn snapshot_handler(
    Path(case_name): Path<String>,
    State(state): State<ServerState>,
) -> Result<String, (StatusCode, String)> {
    if !state.ready.load(Ordering::Relaxed) {
        return Err((
            StatusCode::SERVICE_UNAVAILABLE,
            "GTK server is not ready yet".to_string(),
        ));
    }

    if !is_known_case(&case_name) {
        return Err((StatusCode::NOT_FOUND, format!("Unknown case: {case_name}")));
    }

    let (response_tx, response_rx) = mpsc::sync_channel(1);
    state
        .sender
        .send(NativeRequest {
            case_name,
            response: response_tx,
        })
        .map_err(|_| {
            (
                StatusCode::INTERNAL_SERVER_ERROR,
                "GTK request channel closed".to_string(),
            )
        })?;

    let response = tokio::task::spawn_blocking(move || response_rx.recv());
    tokio::time::timeout(Duration::from_secs(10), response)
        .await
        .map_err(|_| {
            (
                StatusCode::GATEWAY_TIMEOUT,
                "GTK render timed out".to_string(),
            )
        })?
        .map_err(|err| (StatusCode::INTERNAL_SERVER_ERROR, err.to_string()))?
        .map_err(|_| {
            (
                StatusCode::INTERNAL_SERVER_ERROR,
                "GTK response channel closed".to_string(),
            )
        })?
        .map_err(|err| (StatusCode::INTERNAL_SERVER_ERROR, err))
}

async fn ready_handler(State(state): State<ServerState>) -> Result<&'static str, StatusCode> {
    if state.ready.load(Ordering::Relaxed) {
        Ok("ok")
    } else {
        Err(StatusCode::SERVICE_UNAVAILABLE)
    }
}

fn run_server(port_file: Option<PathBuf>) {
    configure_environment();
    gtk::init().expect("Failed to initialize GTK");
    adw::init().expect("Failed to initialize libadwaita");
    configure_rendering();

    let (sender, receiver) = mpsc::channel::<NativeRequest>();
    let receiver = Arc::new(Mutex::new(receiver));
    let ready = Arc::new(AtomicBool::new(true));
    let main_loop = gtk::glib::MainLoop::new(None, false);

    let receiver_for_loop = Arc::clone(&receiver);
    gtk::glib::timeout_add_local(Duration::from_millis(1), move || {
        loop {
            let request = match receiver_for_loop
                .lock()
                .expect("receiver poisoned")
                .try_recv()
            {
                Ok(request) => request,
                Err(mpsc::TryRecvError::Empty) => break,
                Err(mpsc::TryRecvError::Disconnected) => return gtk::glib::ControlFlow::Break,
            };

            handle_snapshot_request(request);
        }

        gtk::glib::ControlFlow::Continue
    });
    debug_log("gtk request loop ready");

    thread::spawn(move || {
        let runtime = tokio::runtime::Builder::new_current_thread()
            .enable_all()
            .build()
            .expect("Failed to build tokio runtime");

        runtime.block_on(async move {
            let listener = std::net::TcpListener::bind("127.0.0.1:0")
                .expect("Failed to bind native HTTP server");
            listener
                .set_nonblocking(true)
                .expect("Failed to make listener nonblocking");
            let port = listener
                .local_addr()
                .expect("Failed to get native server address")
                .port();

            let listener = tokio::net::TcpListener::from_std(listener)
                .expect("Failed to create tokio listener");
            let state = ServerState { sender, ready };
            let router = Router::new()
                .route("/ready", get(ready_handler))
                .route("/{case}", get(snapshot_handler))
                .with_state(state);
            debug_log(format!("http server listening on 127.0.0.1:{port}"));
            if let Some(path) = port_file {
                std::fs::write(&path, format!("{port}\n")).expect("Failed to write port file");
            }
            println!("LISTENING:{port}");
            std::io::stdout().flush().expect("Failed to flush stdout");

            axum::serve(listener, router)
                .await
                .expect("Native HTTP server failed");
        });
    });

    main_loop.run();
}

fn main() {
    let cli = Cli::parse();
    let output = cli.output;

    match cli.command {
        Command::Serve { port_file } => run_server(port_file),
        command => run_single_snapshot(command.case_name().expect("case command"), output),
    }
}
