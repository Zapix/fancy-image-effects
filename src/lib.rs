mod utils;

use wasm_bindgen::prelude::*;
use web_sys::HtmlDivElement;

#[wasm_bindgen]
extern "C" {
    fn alert(s: &str);
}

#[wasm_bindgen]
pub fn render_canvas(container: &HtmlDivElement) {
    let width = container.client_width();
    let height = container.client_height();
    let message = format!("Container size: {}x{}", width, height);
    container.set_text_content(Some(&message.as_str()));
}
