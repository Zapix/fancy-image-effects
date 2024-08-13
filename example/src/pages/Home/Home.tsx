import * as React from 'react';
import { Box, Typography } from '@mui/material';

export const Home = () => (
    <Box
        sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center'
        }}
    >
        <Typography variant='h2' component='h2'>Welcome To React Effects</Typography>
        <Typography component='p'>
            This is a library that uses rust + wgpu to make small but fancy effects in your image
        </Typography>
    </Box>
);
