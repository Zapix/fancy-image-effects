import * as React from "react";
import { Application } from "fancy-image-effects";

import image1 from './images/img_5300.jpg';
import image2 from './images/IMG_5301.jpg';
import image3 from './images/IMG_5302.jpg';
import image4 from './images/IMG_5303.jpg';
import image5 from './images/IMG_5304.jpg';

const WIDTH= 512;
const HEIGHT = 512;

function App() {
    const [value, setValue] = React.useState(0.0);
    const [image, setImage] = React.useState<string>(image3);

    const ref = React.useRef<HTMLDivElement | null>(null);
    const applicationRef = React.useRef<Application | null>(null);
    const frameRef = React.useRef<number | null>();
    React.useEffect(() => {
        const { current } = ref;
        if (current !== null) {
            Application.new(current, image).then((application) => {
                applicationRef.current = application;
                application.render();
            });
        }
    }, []);

    React.useEffect(() => {
        frameRef.current = requestAnimationFrame(() => {
            let { current: application } = applicationRef;
            if (application !== null) {
                console.log("Render application");
                application.render();
            }
        });
        return () => {
            const { current: frameRequestId } = frameRef;
            if (frameRequestId) {
                cancelAnimationFrame(frameRequestId);
            }
        }
    });

    React.useEffect(() => {
        let { current: application } = applicationRef;
        if (application !== null) {
            application.set_value(value);
        }
    }, [value]);

    React.useEffect(() => {
        let { current: application } = applicationRef;
        if (application !== null) {
            application.set_image(image).then(() => {
                application.render();
            });
        }
    }, [image]);

    return (
        <>
            <div ref={ref} style={{width: WIDTH, height: HEIGHT}} />
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
