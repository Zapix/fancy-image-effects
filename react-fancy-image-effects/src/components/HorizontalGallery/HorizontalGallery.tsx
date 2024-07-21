import * as React from 'react';

import { Box } from '@mui/material'
import { Size } from './types';

import { ImageItem } from './ImageItem';
import {useCallback, useEffect} from "react";

export type HorizontalGalleryProps = {
    images: string[],
    size: Size,
};
export function HorizontalGallery({ images, size }: HorizontalGalleryProps) {
    const [mounted, setMounted] = React.useState<boolean>()
    const containerRef = React.useRef<HTMLDivElement>(null);

    const containerCb = useCallback((node: HTMLDivElement) => {
        containerRef.current = node;
        setMounted(true);
        return () => setMounted(() => false);
    }, []);

    return (
        <Box
            ref={containerCb}
            sx={{
                width: '100%',
                overflowX: 'auto',
                overflowY: 'hidden',
                display: 'flex',
                flexDirection: 'row',
                gap: 20,
                scrollSnapType: 'x mandatory',
            }}
        >
            <Box sx={{ ...size, minWidth: size.width }}><span /></Box>
            {
                (mounted && containerRef.current) ?
                    (
                        images.map((image, i) => (
                            <ImageItem
                                key={image}
                                debug={i === 1}
                                image={image}
                                size={size}
                                container={containerRef.current}
                            />
                        ))
                    ) :
                    null
            }
            <Box sx={{ ...size, minWidth: size.width }}><span /></Box>
        </Box>
    );
}