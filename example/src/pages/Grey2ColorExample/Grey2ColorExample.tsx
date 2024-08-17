import * as React from 'react';
import {Box, Slider} from '@mui/material';
import { FancyImage, ImageShader } from 'react-fancy-image-effects';

import image1 from '../../../images/img_5300.jpg';
import image2 from '../../../images/IMG_5301.jpg';
import image3 from '../../../images/IMG_5302.jpg';
import image4 from '../../../images/IMG_5303.jpg';
import image5 from '../../../images/IMG_5304.jpg';

const WIDTH= 512;
const HEIGHT = 512;

type Target = {
    value: string;
    name: string;
}

const isEventTarget = (e: unknown): e is Target => {
    return (e && !!(e as any).value && !!(e as any).name);
}

export const Grey2ColorExample = () => {
    const [value, setValue] = React.useState(0.0);
    const [reversed, setReversed] = React.useState(false);
    const [image, setImage] = React.useState<string>(image3);

    return (
        <Box sx={{ m: 4 }}>
            <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
                <FancyImage
                    width={WIDTH}
                    height={HEIGHT}
                    shader={ImageShader.Grey2Color}
                    src={image}
                    value={value}
                    reversed={reversed}
                />
            </Box>
            <Box>
                <Slider
                    step={0.01}
                    min={0}
                    max={1}
                    value={value}
                    name={"Size"}
                    onChange={(e) => {
                        const { target } = e;
                        if (isEventTarget(target)) {
                            setValue(+target.value);
                        }
                    }}
                    valueLabelDisplay="auto"
                />
            </Box>
            <Box>
                <label><input type="checkbox" value={reversed ? "checked" : ""} onChange={(e) => {
                    setReversed(e.target.checked);
                }} />Reversed</label>
            </Box>
            <Box>
                <select value={image} onChange={(e) => setImage(e.target.value)}>
                    <option value={image1}>Sherri 1</option>
                    <option value={image2}>Sherri 2</option>
                    <option value={image3}>Sherri 3</option>
                    <option value={image4}>Sherri 4</option>
                    <option value={image5}>Sherri 5</option>
                </select>
            </Box>
        </Box>
    );
};