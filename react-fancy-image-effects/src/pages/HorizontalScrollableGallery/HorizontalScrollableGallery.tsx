import * as React from 'react';

import image1 from '../../../images/img_5300.jpg';
import image2 from '../../../images/IMG_5301.jpg';
import image3 from '../../../images/IMG_5302.jpg';
import image4 from '../../../images/IMG_5303.jpg';
import image5 from '../../../images/IMG_5304.jpg';
import {HorizontalGallery} from "../../components/HorizontalGallery";
import {Box, Typography} from "@mui/material";

const WIDTH= 512;
const HEIGHT = 512;

export function HorizontalScrollableGallery() {
    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column'
            }}
        >
            <Typography variant="h1">Horizontal Gallery</Typography>
            <Box
                sx={{
                    mx: 8
                }}
            >
                <HorizontalGallery
                    size={{ width: WIDTH, height: HEIGHT }}
                    images={[image1, image2, image3, image4, image5]}
                />
            </Box>
        </Box>
    )
}