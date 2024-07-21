import * as React from 'react';
import {List, ListItemText, ListItemButton, ListItemIcon, ListItem} from '@mui/material';
import {
    Home as HomeIcon,
    Image as ImageIcon,
    Collections as CollectionsIcon,
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
        <ListItemButton component={Link} to={'/horizontal-scrollable-gallery'}>
            <ListItemIcon>
                <CollectionsIcon />
            </ListItemIcon>
            <ListItemText>Horizontal Gall</ListItemText>
        </ListItemButton>
    </List>
);