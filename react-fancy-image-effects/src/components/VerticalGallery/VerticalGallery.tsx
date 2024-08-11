import * as React from 'react';
import { Box } from '@mui/material';

import { Size } from '../../common/types';

export type VerticalGalleryProps = {
    images: string[];
    size: Size;
}

export const VerticalGallery = ({ images, size }: VerticalGalleryProps) => (
    <Box
        sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
        }}
    >
    </Box>
);