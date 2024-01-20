mod utils;

use wasm_bindgen::prelude::*;
use web_sys::HtmlDivElement;

#[wasm_bindgen]
extern "C" {
    fn alert(s: &str);
}

#[wasm_bindgen]
pub fn greet(name: String) {
    let message = format!("Hello, {}", name.as_str());
    alert(message.as_str());
}

#[wasm_bindgen]
pub fn render_greet(name: String, container: &HtmlDivElement) {
    let message = format!("Rust says: {}", name.as_str());
    container.set_text_content(Some(&message.as_str()));
}
