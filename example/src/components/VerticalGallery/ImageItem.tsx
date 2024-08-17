import * as React from 'react';
import { Box } from '@mui/material';

import { FancyImage, ImageShader } from 'react-fancy-image-effects';
import { Size } from "../../common/types";


const thresholds = new Array(201).fill(null).map((_item, i) => i * 0.005);

export type ImageItemProps = {
    image: string,
    size: Size,
    container: HTMLDivElement,
};

export const ImageItem = ({
    image,
    size,
    container,
}:ImageItemProps) => {
    const [ratio, setRatio] = React.useState<number | null>(null);
    const imageRef = React.useRef<HTMLDivElement>();
    const intersectionObserver = React.useRef<IntersectionObserver>();

    const imageCb = React.useCallback((node: HTMLDivElement | null) => {
        if (!node) {
            if (!intersectionObserver.current && imageRef.current) {
                intersectionObserver.current.unobserve(imageRef.current)
            }
            imageRef.current = null;
            return;
        }

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries.length > 0) {
                    const entry = entries[0];
                    setRatio(entry.intersectionRatio);
                }
            },
            {
                root: container,
                rootMargin: "-128px 0px",
                threshold: thresholds,
            }
        );
        observer.observe(node);
        imageRef.current = node;
        intersectionObserver.current = observer;
    }, []);

    return (
        <Box
            ref={imageCb}
            sx={{
                scrollSnapAlign: 'center',
                width: '100%',
                height: '100%',
                maxWidth: size.width,
                maxHeight: size.height,
                aspectRatio: `${size.width}/${size.height}`,
            }}
        >
            {ratio != null ? (
                <FancyImage
                    src={image}
                    shader={ImageShader.Grey2Color}
                    value={ratio}
                    reversed={false}
                    width={size.width}
                    height={size.height}
                />
            ) : null}
        </Box>
    );
}