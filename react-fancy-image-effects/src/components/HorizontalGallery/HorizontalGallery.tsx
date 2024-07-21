import * as React from 'react';

import { Box } from '@mui/material'
import { Size } from './types';

import { ImageItem } from './ImageItem';

export type HorizontalGalleryProps = {
    images: string[],
    size: Size,
};
export function HorizontalGallery({ images, size }: HorizontalGalleryProps) {
    return (
        <Box
            sx={{
                width: '100%',
                overflowX: 'auto',
                display: 'flex',
                flexDirection: 'row',
                gap: 20,
                scrollSnapType: 'x mandatory',
            }}
        >
            <Box sx={{ ...size, minWidth: size.width }}><span /></Box>
            {images.map((image) => (
                <ImageItem key={image} image={image} size={size} />
            ))}
            <Box sx={{ ...size, minWidth: size.width }}><span /></Box>
        </Box>
    );
}