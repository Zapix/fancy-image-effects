import * as React from 'react';
import {List, ListItemText, ListItemButton, ListItemIcon} from '@mui/material';
import {
    Home as HomeIcon,
    Image as ImageIcon,
} from '@mui/icons-material';
import { Link } from 'react-router-dom';

export const AppMenu = () => (
    <List>
        <ListItemButton component={Link} to={'/'}>
            <ListItemIcon>
                <HomeIcon />
            </ListItemIcon>
            <ListItemText>Home</ListItemText>
        </ListItemButton>
        <ListItemButton component={Link} to={'/fade-by-column'}>
            <ListItemIcon>
                <ImageIcon />
            </ListItemIcon>
            <ListItemText>Fade By Column</ListItemText>
        </ListItemButton>
    </List>
);