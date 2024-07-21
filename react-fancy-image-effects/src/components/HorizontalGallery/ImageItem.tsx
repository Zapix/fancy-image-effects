import * as React from 'react';
import { Box } from '@mui/material';

import {Size} from "./types";

export type ImageItemProps = {
    image: string;
    size: Size
};

export function ImageItem({ image, size }: ImageItemProps) {
    return (
        <Box
            sx={{
                scrollSnapAlign: 'center',
                bgcolor: 'grey',
                ...size,
            }}
        >
            Image: {image}
        </Box>
    );
}