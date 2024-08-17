import { useRef, useEffect }  from 'react'
import {Application, ImageShader} from 'fancy-image-effects';

export type FancyImageProps = {
    width: number,
    height: number,
    shader: ImageShader,
    reversed: boolean,
    src: string,
    value: number,
};

export function FancyImage(props: FancyImageProps) {
    const prevPropsRef = useRef<FancyImageProps | null>(null);
    const ref = useRef<HTMLDivElement | null>(null);
    const applicationRef = useRef<Application | null>(null);
    const frameRef = useRef<number | null>();

    useEffect(() => {
        const { current } = ref;
        if (current !== null) {
            const { src, shader, reversed , value} = props;
            Application.new(current, shader, src, reversed, value).then(application => {
                applicationRef.current = application;
                application.render();
            });
        }
    }, []);

    useEffect(() => {
        const { current: prevProps } = prevPropsRef;
        const { current: application }  = applicationRef;
        if (prevProps === null) {
            prevPropsRef.current = props;
            return;
        }

        if (application === null) {
            return;
        }

        if (Object.is(prevProps, props)) {
            return;
        }

        if (prevProps.value !== props.value) {
            application.set_value(props.value);
        }

        if (prevProps.reversed !== props.reversed) {
            application.set_reversed(props.reversed);
        }

        if (prevProps.src !== props.src) {
            application.set_image(props.src).then(() => {
                application.render();
            });
        }

        if (prevProps.height !== props.height || prevProps.width !== props.width) {
            throw new Error("Can not change width and height of fancy image");
        }

        prevPropsRef.current = props;
    }, [props]);

    useEffect(() => {
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

    const { width, height } = props;
    return (
        <div
            ref={ref}
            style={{
                maxWidth: width,
                maxHeight: height,
                width: '100%',
                height: '100%',
                aspectRatio: width / height,
            }}
        />
    );
}