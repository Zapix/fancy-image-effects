import * as React from 'react';
import { Box, Typography } from "@mui/material";


export const VerticalScrollableGallery = () =>  {
    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'flex-start',
            }}
        >
            <Box
                sx={{ flexGrow: 0 }}
            >
                <Typography variant="h2" sx={{ mb: 4 }}>Vertical Gallery</Typography>
            </Box>
            <Box sx={{ flexGrow: 1 }}>

            </Box>
        </Box>
    );
}