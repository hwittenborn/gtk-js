use relm4::gtk;
use relm4::gtk::gdk;
use relm4::gtk::glib;
use relm4::gtk::gsk;
use relm4::gtk::gsk::RenderNodeType;
use relm4::gtk::gsk::prelude::*;
use relm4::gtk::prelude::*;
use serde::Serialize;

#[derive(Debug, Serialize)]
pub struct WidgetSnapshot {
    pub width: f32,
    pub height: f32,
    pub padding: Sides,
    pub border_radius: Corners,
    pub background_color: Option<Color>,
    pub border_widths: Sides,
    pub border_colors: SideColors,
    pub color: Option<Color>,
    pub font_family: Option<String>,
    pub font_weight: Option<u32>,
    pub shadows: Vec<ShadowInfo>,
    pub inset_shadows: Vec<InsetShadowInfo>,
    pub opacity: f32,
}

#[derive(Debug, Serialize, Default)]
pub struct Sides {
    pub top: f32,
    pub right: f32,
    pub bottom: f32,
    pub left: f32,
}

#[derive(Debug, Serialize, Default)]
pub struct Corners {
    pub top_left: f32,
    pub top_right: f32,
    pub bottom_right: f32,
    pub bottom_left: f32,
}

#[derive(Debug, Serialize)]
pub struct Color {
    pub r: f32,
    pub g: f32,
    pub b: f32,
    pub a: f32,
}

#[derive(Debug, Serialize, Default)]
pub struct SideColors {
    pub top: Option<Color>,
    pub right: Option<Color>,
    pub bottom: Option<Color>,
    pub left: Option<Color>,
}

#[derive(Debug, Serialize)]
pub struct ShadowInfo {
    pub color: Color,
    pub dx: f32,
    pub dy: f32,
    pub radius: f32,
}

#[derive(Debug, Serialize)]
pub struct InsetShadowInfo {
    pub color: Color,
    pub dx: f32,
    pub dy: f32,
    pub spread: f32,
    pub blur_radius: f32,
}

fn rgba_to_color(rgba: &gdk::RGBA) -> Color {
    Color {
        r: rgba.red(),
        g: rgba.green(),
        b: rgba.blue(),
        a: rgba.alpha(),
    }
}

#[allow(deprecated)]
pub fn extract_with_widget<W: IsA<gtk::Widget>>(node: &gsk::RenderNode, widget: &W) -> WidgetSnapshot {
    let mut snapshot = extract_snapshot(node);
    let w = widget.as_ref();

    snapshot.width = w.width() as f32;
    snapshot.height = w.height() as f32;

    // Text color via widget.color() — reliable on all GTK4 versions
    // (TextNode::color() returns garbage on GTK 4.18+ due to GdkColor/GdkRGBA mismatch)
    let color = w.color();
    snapshot.color = Some(rgba_to_color(&color));

    // Padding/border via deprecated GtkStyleContext — still works on GTK 4.20,
    // and there's no non-deprecated replacement for reading computed CSS padding.
    let ctx = w.style_context();
    let padding = ctx.padding();
    snapshot.padding = Sides {
        top: padding.top() as f32,
        right: padding.right() as f32,
        bottom: padding.bottom() as f32,
        left: padding.left() as f32,
    };

    let border = ctx.border();
    snapshot.border_widths = Sides {
        top: border.top() as f32,
        right: border.right() as f32,
        bottom: border.bottom() as f32,
        left: border.left() as f32,
    };

    snapshot
}

pub fn extract_snapshot(node: &gsk::RenderNode) -> WidgetSnapshot {
    let bounds = node.bounds();
    let mut snapshot = WidgetSnapshot {
        width: bounds.width(),
        height: bounds.height(),
        padding: Sides::default(),
        border_radius: Corners::default(),
        background_color: None,
        border_widths: Sides::default(),
        border_colors: SideColors::default(),
        color: None,
        font_family: None,
        font_weight: None,
        shadows: Vec::new(),
        inset_shadows: Vec::new(),
        opacity: 1.0,
    };

    walk_node(node, &mut snapshot);
    snapshot
}

fn walk_node(node: &gsk::RenderNode, snapshot: &mut WidgetSnapshot) {
    match node.node_type() {
        RenderNodeType::ContainerNode => {
            let container: gsk::ContainerNode = node.clone().downcast().unwrap();
            for i in 0..container.n_children() {
                walk_node(&container.child(i), snapshot);
            }
        }

        RenderNodeType::ColorNode => {
            let color_node: gsk::ColorNode = node.clone().downcast().unwrap();
            if snapshot.background_color.is_none() {
                snapshot.background_color = Some(rgba_to_color(&color_node.color()));
            }
        }

        RenderNodeType::RoundedClipNode => {
            let clip_node: gsk::RoundedClipNode = node.clone().downcast().unwrap();
            let clip = clip_node.clip();
            let corners = clip.corner();

            if snapshot.border_radius.top_left == 0.0 && snapshot.border_radius.top_right == 0.0 {
                snapshot.border_radius = Corners {
                    top_left: corners[0].width(),
                    top_right: corners[1].width(),
                    bottom_right: corners[2].width(),
                    bottom_left: corners[3].width(),
                };
            }

            let clip_bounds = clip.bounds();
            let child = clip_node.child();
            let child_bounds = child.bounds();

            if snapshot.padding.top == 0.0
                && snapshot.padding.right == 0.0
                && child_bounds.width() < clip_bounds.width()
            {
                snapshot.padding = Sides {
                    top: child_bounds.y() - clip_bounds.y(),
                    right: (clip_bounds.x() + clip_bounds.width())
                        - (child_bounds.x() + child_bounds.width()),
                    bottom: (clip_bounds.y() + clip_bounds.height())
                        - (child_bounds.y() + child_bounds.height()),
                    left: child_bounds.x() - clip_bounds.x(),
                };
            }

            walk_node(&child, snapshot);
        }

        RenderNodeType::BorderNode => {
            let border_node: gsk::BorderNode = node.clone().downcast().unwrap();
            let widths = border_node.widths();
            snapshot.border_widths = Sides {
                top: widths[0],
                right: widths[1],
                bottom: widths[2],
                left: widths[3],
            };

            let colors = border_node.colors();
            snapshot.border_colors = SideColors {
                top: Some(rgba_to_color(&colors[0])),
                right: Some(rgba_to_color(&colors[1])),
                bottom: Some(rgba_to_color(&colors[2])),
                left: Some(rgba_to_color(&colors[3])),
            };
        }

        RenderNodeType::TextNode => {
            // NOTE: TextNode::color() returns garbage on GTK 4.18+ due to
            // GdkColor/GdkRGBA layout mismatch in the C API. Text color is
            // extracted via widget.get_color() instead (see extract_with_widget).
            let text_node = node.downcast_ref::<gsk::TextNode>().unwrap();

            if snapshot.font_family.is_none() {
                let font = text_node.font();
                let desc = font.describe();
                snapshot.font_family = desc.family().map(|f| f.to_string());
                snapshot.font_weight =
                    Some(glib::translate::IntoGlib::into_glib(desc.weight()) as u32);
            }
        }

        RenderNodeType::ShadowNode => {
            let shadow_node: gsk::ShadowNode = node.clone().downcast().unwrap();
            for i in 0..shadow_node.n_shadows() {
                let shadow = shadow_node.shadow(i);
                snapshot.shadows.push(ShadowInfo {
                    color: rgba_to_color(shadow.color()),
                    dx: shadow.dx(),
                    dy: shadow.dy(),
                    radius: shadow.radius(),
                });
            }
            walk_node(&shadow_node.child(), snapshot);
        }

        RenderNodeType::InsetShadowNode => {
            let inset_node: gsk::InsetShadowNode = node.clone().downcast().unwrap();
            snapshot.inset_shadows.push(InsetShadowInfo {
                color: rgba_to_color(&inset_node.color()),
                dx: inset_node.dx(),
                dy: inset_node.dy(),
                spread: inset_node.spread(),
                blur_radius: inset_node.blur_radius(),
            });
        }

        RenderNodeType::OpacityNode => {
            let opacity_node: gsk::OpacityNode = node.clone().downcast().unwrap();
            snapshot.opacity = opacity_node.opacity();
            walk_node(&opacity_node.child(), snapshot);
        }

        RenderNodeType::TransformNode => {
            let transform_node: gsk::TransformNode = node.clone().downcast().unwrap();
            walk_node(&transform_node.child(), snapshot);
        }

        RenderNodeType::ClipNode => {
            let clip_node: gsk::ClipNode = node.clone().downcast().unwrap();
            walk_node(&clip_node.child(), snapshot);
        }

        RenderNodeType::DebugNode => {
            let debug_node: gsk::DebugNode = node.clone().downcast().unwrap();
            walk_node(&debug_node.child(), snapshot);
        }

        // Visual-only nodes that don't carry CSS-equivalent properties.
        // Icons (FillNode, StrokeNode, CairoNode, TextureNode), gradients,
        // and compositing nodes are rendering details — we compare icon
        // presence via the widget tree, not pixel output.
        RenderNodeType::FillNode
        | RenderNodeType::StrokeNode
        | RenderNodeType::CairoNode
        | RenderNodeType::TextureNode
        | RenderNodeType::MaskNode
        | RenderNodeType::LinearGradientNode
        | RenderNodeType::RepeatingLinearGradientNode
        | RenderNodeType::RadialGradientNode
        | RenderNodeType::ConicGradientNode
        | RenderNodeType::ColorMatrixNode
        | RenderNodeType::BlurNode
        | RenderNodeType::BlendNode
        | RenderNodeType::CrossFadeNode
        | RenderNodeType::OutsetShadowNode
        | RenderNodeType::RepeatNode
        | RenderNodeType::GlShaderNode => {}

        other => {
            panic!("Unhandled render node type: {:?}", other);
        }
    }
}
