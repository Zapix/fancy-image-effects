import * as React from "react";
import { render_canvas } from 'fancy-image-effects';

const WIDTH= 512;
const HEIGHT = 512;

function App() {
    const ref = React.useRef<HTMLDivElement | null>(null);
    React.useEffect(() => {
        const { current } = ref;
        if (current !== null) {
            render_canvas(current);
        }
    }, []);

    return (
        <div ref={ref} style={{ width: WIDTH, height: HEIGHT }}>
            Hello React
        </div>
    );
}

export default App;
