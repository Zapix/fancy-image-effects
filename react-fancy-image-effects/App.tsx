import * as React from "react";
import { Box, CssBaseline } from '@mui/material';

import { Layout } from './src/layout';
import { AppMenu, FadeColumnExample } from './src/components';


function App() {
    return (
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <CssBaseline />
            <Layout
                renderMenu={AppMenu}
            >
                <Box sx={{ grow: 1 }}>
                    <FadeColumnExample />
                </Box>
            </Layout>
        </Box>
    );
}

export default App;
