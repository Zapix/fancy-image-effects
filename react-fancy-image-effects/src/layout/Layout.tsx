import * as React from 'react';
import type { PropsWithChildren, ReactNode } from 'react';
import { AppBar, Box, IconButton, Toolbar, Typography, Drawer, Divider} from '@mui/material';
import { Menu as MenuIcon } from '@mui/icons-material';

const DRAWER_WIDTH = 240;

export type LayoutProps = PropsWithChildren<{
    renderMenu: () => ReactNode;
}>;

export const Layout = ({ children, renderMenu  }: LayoutProps) => {
    const [drawerStatus, setDrawerStatus] = React.useState<boolean>(false);
    const toggleDrawer = React.useCallback(() => setDrawerStatus(status => !status), [])

    const drawer = (
        <Box sx={{ width: DRAWER_WIDTH }}>
            <Toolbar />
            <Divider />
            {renderMenu()}
        </Box>
    );

    return (
        <Box
            sx={{
                marginLeft: {
                    xs: 0,
                    md: `${DRAWER_WIDTH}px`
                }
            }}
        >
            <AppBar position="static">
                <Toolbar>
                    <IconButton
                        onClick={toggleDrawer}
                        edge="start"
                        color="inherit"
                        aria-label="menu"
                        sx={{
                            mr: 2,
                            display: {
                                md: 'none',
                            }
                        }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" >React Fancy Image Effects</Typography>
                </Toolbar>
            </AppBar>
            <Drawer
                open={drawerStatus}
                onClose={toggleDrawer}
                sx={{
                    display: {
                        xs: 'block',
                        md: 'none',
                    }
                }}
            >
                {drawer}
            </Drawer>
            <Drawer
                variant="permanent"
                anchor="left"
                sx={{
                    display: {
                        xs: 'none',
                        md: 'block',
                    }
                }}
            >
                {drawer}
            </Drawer>
            {children}
        </Box>
    );
};