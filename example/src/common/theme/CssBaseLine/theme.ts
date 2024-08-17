import { Theme } from '@mui/material'

export const theme: Theme['components']['MuiCssBaseline'] = {
   styleOverrides: () => `
    body {
        width: 100vw;
        height: 100vh;
    }
    
    #app {
      width: 100vw;
      height: 100vh;
    }
    `
}