import * as React from 'react';
import { Box } from '@mui/material';

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
    const prevPropsRef = React.useRef<FancyImageProps | null>(null);
    const ref = React.useRef<HTMLDivElement | null>(null);
    const applicationRef = React.useRef<Application | null>(null);
    const frameRef = React.useRef<number | null>();

    React.useEffect(() => {
        const { current } = ref;
        if (current !== null) {
            const { src, shader, reversed , value} = props;
            Application.new(current, shader, src, reversed, value).then(application => {
                applicationRef.current = application;
                application.render();
            });
        }
    }, []);

    React.useEffect(() => {
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

    const { width, height } = props;
    return (
        <Box
            ref={ref}
            sx={{
                maxWidth: width,
                maxHeight: height,
                width: '100%',
                height: '100%',
                aspectRatio: width / height,
            }}
        />
    );
}