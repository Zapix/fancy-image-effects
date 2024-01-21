mod utils;

use wasm_bindgen::prelude::*;
use web_sys::HtmlDivElement;

#[wasm_bindgen]
extern "C" {
    fn alert(s: &str);
}

#[wasm_bindgen]
pub fn render_canvas(container: HtmlDivElement) {
    let width = container.client_width();
    let height = container.client_height();
    let message = format!("Container size: {}x{}", width, height);
    container.set_text_content(Some(&message.as_str()));
}

#[wasm_bindgen]
struct Application {
    container: HtmlDivElement,
    value: f32,
}

#[wasm_bindgen]
impl Application {
    pub fn new(container: HtmlDivElement) -> Self {
        let value = 0.0 as f32;
        Self {
            container,
            value
        }
    }

    pub fn set_value(&mut self, value: f32) {
        self.value = value;
    }

    pub fn render(&mut self) {
        let message = format!("Value: {:.3}", self.value);
        self.container.set_text_content(
            Some(&message.as_str())
        );
    }
}
