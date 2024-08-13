import * as React from "react";
import { RouterProvider } from 'react-router-dom';
import { ThemeProvider} from '@mui/material';

import { theme } from './common/theme';
import { router } from './router'

const App = () => {
    return (
        <ThemeProvider theme={theme}>
            <RouterProvider router={router} />
        </ThemeProvider>
    );
}

export default App;
