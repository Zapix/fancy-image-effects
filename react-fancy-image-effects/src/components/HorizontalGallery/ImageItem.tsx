import * as React from 'react';
import { Box } from '@mui/material';

import { FancyImage } from '../FancyImage';
import { ImageShader } from 'fancy-image-effects';

import {Size} from "./types";
import {FaceRetouchingNaturalSharp} from "@mui/icons-material";

export type ImageItemProps = {
    debug?: boolean;
    image: string;
    size: Size
    container: HTMLDivElement,
};

const thresholds = new Array(201).fill(null).map((_item, i) => i * 0.005);

export function ImageItem({ debug, image, size, container }: ImageItemProps) {
    const [ratio, setRatio] = React.useState<number | null>(null);
    const [leftSide, setLeftSide] = React.useState<boolean>(false)
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
                    setLeftSide(entry.rootBounds.x === entry.intersectionRect.x);
                }
            },
            {
                root: container,
                rootMargin: "0px -100px",
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
                minWidth: size.width,
                minHeight: size.height,
                ...size,
            }}
        >
            {ratio != null ? (
                <FancyImage
                    src={image}
                    shader={ImageShader.ColFade}
                    value={ratio}
                    reversed={leftSide}
                    width={size.width}
                    height={size.height}
                />
            ) : null}
        </Box>
    );
}