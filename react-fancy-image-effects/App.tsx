import * as React from "react";
import { ImageShader } from 'fancy-image-effects';

import image1 from './images/img_5300.jpg';
import image2 from './images/IMG_5301.jpg';
import image3 from './images/IMG_5302.jpg';
import image4 from './images/IMG_5303.jpg';
import image5 from './images/IMG_5304.jpg';
import FancyImage from "./src/FancyImage";

const WIDTH= 512;
const HEIGHT = 512;

function App() {
    const [value, setValue] = React.useState(0.0);
    const [reversed, setReversed] = React.useState(false);
    const [image, setImage] = React.useState<string>(image3);

    return (
        <>
            <FancyImage
                width={WIDTH}
                height={HEIGHT}
                shader={ImageShader.CellFade}
                src={image}
                value={value}
                reversed={reversed}
            />
            <div>
                <input
                    type="range"
                    min={0}
                    max={1}
                    value={value}
                    onChange={(e) => {setValue(+e.target.value);}}
                    step="any"
                />
            </div>
            <div>
                <label><input type="checkbox" value={reversed ? "checked" : ""} onChange={(e) => {
                    setReversed(e.target.checked);
                }} />Reversed</label>
            </div>
            <div>
                <select value={image} onChange={(e) => setImage(e.target.value)}>
                    <option value={image1}>Sherri 1</option>
                    <option value={image2}>Sherri 2</option>
                    <option value={image3}>Sherri 3</option>
                    <option value={image4}>Sherri 4</option>
                    <option value={image5}>Sherri 5</option>
                </select>
            </div>
        </>
    );
}

export default App;
