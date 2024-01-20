mod utils;

use wasm_bindgen::prelude::*;

#[wasm_bindgen]
extern "C" {
    fn alert(s: &str);
}

#[wasm_bindgen]
pub fn greet(name: String) {
    let message = format!("Hello, {}", name.as_str());
    alert(message.as_str());
}
