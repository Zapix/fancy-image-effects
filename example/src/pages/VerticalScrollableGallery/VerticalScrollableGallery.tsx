import * as React from 'react';
import { Box, Typography } from "@mui/material";

import image1 from '../../../images/img_5300.jpg';
import image2 from '../../../images/IMG_5301.jpg';
import image3 from '../../../images/IMG_5302.jpg';
import image4 from '../../../images/IMG_5303.jpg';
import image5 from '../../../images/IMG_5304.jpg';
import { VerticalGallery } from "../../components";

const WIDTH= 512;
const HEIGHT = 512;

export const VerticalScrollableGallery = () =>  {
    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                height: '100%',
            }}
        >
            <Box
                sx={{
                   flexGrow: 1,
                   minHeight: 0,
                   width: '100%',
                }}
            >
                <Box
                    sx={{
                        height: '100%',
                        width: '100%',
                        overflowY: 'auto',
                    }}
                >
                    <VerticalGallery
                        size={{ width: WIDTH, height: HEIGHT }}
                        images={[image1, image2, image3, image4, image5]}
                    />
                </Box>
            </Box>
        </Box>
    );
}