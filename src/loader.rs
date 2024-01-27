use std::io::Cursor;

use wasm_bindgen::prelude::*;
use wasm_bindgen_futures::JsFuture;
use web_sys::{Request, RequestInit, RequestMode, Response};
use web_sys::console::{log_1};
use image::io::Reader as ImageReader;
use image::{DynamicImage};
use wasm_bindgen_futures::js_sys::Uint8Array;

pub async fn fetch_image(image_url: &str) -> Result<DynamicImage, JsValue>{
    let mut opts = RequestInit::new();
    opts.method("GET");
    opts.mode(RequestMode::Cors);

    let request = Request::new_with_str_and_init(image_url, &opts)?;

    log_1(&format!("Fetch image by url {}", image_url).as_str().into());
    let window = web_sys::window().unwrap();
    let resp_value = JsFuture::from(window.fetch_with_request(&request)).await?;

    assert!(resp_value.is_instance_of::<Response>());
    let resp: Response = resp_value.dyn_into().unwrap();
    log_1(&format!("Response status: {}", resp.status()).as_str().into());

    let array_buffer = JsFuture::from(resp.array_buffer()?).await.unwrap();
    let uint8_array = Uint8Array::new(&array_buffer).to_vec();
    log_1(&format!("uint8_array length: {}", uint8_array.len()).as_str().into());
    let image = ImageReader::new(Cursor::new(uint8_array))
        .with_guessed_format()
        .unwrap()
        .decode()
        .unwrap();
    log_1(&format!("image size: {}x{}", image.width(), image.height()).as_str().into());

    Ok(image)
}