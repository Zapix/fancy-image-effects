import { Theme, createTheme } from '@mui/material';
import { theme as cssBaseLineTheme } from "./CssBaseLine";

export const theme: Theme = createTheme({
    components: {
        MuiCssBaseline: cssBaseLineTheme
    }
});