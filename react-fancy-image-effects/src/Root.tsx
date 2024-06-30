import * as React from 'react';
import { Outlet } from 'react-router-dom';
import { Box, CssBaseline } from '@mui/material';

import { Layout } from './layout';
import { AppMenu } from "./components";

export const Root = () => {
    return (
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <CssBaseline />
            <Layout
                renderMenu={AppMenu}
            >
                <Box sx={{ grow: 1 }}>
                    <Outlet />
                </Box>
            </Layout>
        </Box>
    );
}