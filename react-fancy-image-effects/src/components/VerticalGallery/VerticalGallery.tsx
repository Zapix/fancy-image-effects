import * as React from 'react';
import { Box } from '@mui/material';

import { Size } from '../../common/types';
import {ImageItem} from "./ImageItem";

export type VerticalGalleryProps = {
    images: string[];
    size: Size;
}

export const VerticalGallery = ({ images, size }: VerticalGalleryProps) => {
    const [mounted, setMounted] = React.useState<boolean>()
    const containerRef = React.useRef<HTMLDivElement>(null);

    const containerCb = React.useCallback((node: HTMLDivElement) => {
        containerRef.current = node;
        setMounted(true);
        return () => setMounted(() => false);
        },
        []
    );

    return (
        <Box
            ref={containerCb}
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                minHeight: 0,
                overflowY: 'auto',
                width: '100%',
                height: '100%',
                gap: 10,
                p: 2,
            }}
        >
            <Box sx={{ height: 10 }} />
            {mounted && containerRef.current ? (
                images.map((image) => (
                    <ImageItem key={image} image={image} size={size} container={containerRef.current} />
                ))
            ) : null}
            <Box sx={{ height: 10 }} />
        </Box>
    );
};