import * as React from "react";
import { Application } from 'fancy-image-effects';

const WIDTH= 512;
const HEIGHT = 512;

function App() {
    const [value, setValue] = React.useState(0.0);

    const ref = React.useRef<HTMLDivElement | null>(null);
    const applicationRef = React.useRef<Application | null>(null);
    const frameRef = React.useRef<number | null>();
    React.useEffect(() => {
        const { current } = ref;
        if (current !== null) {
            Application.new(current).then((application) => {
                applicationRef.current = application;
            });
        }
    }, []);

    React.useEffect(() => {
        frameRef.current = requestAnimationFrame(() => {
            let { current: application } = applicationRef;
            if (application !== null) {
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
        </>
    );
}

export default App;
