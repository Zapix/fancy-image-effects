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
        <ListItemButton component={Link} to={'/vertical-grey-scroll'}>
            <ListItemIcon>
                <ImageIcon />
            </ListItemIcon>
            <ListItemText>Vertical Grey Scroll</ListItemText>
        </ListItemButton>
        <ListItemButton component={Link} to={'/horizontal-grey-scroll'}>
            <ListItemIcon>
                <ImageIcon />
            </ListItemIcon>
            <ListItemText>Horizontal Grey Scroll</ListItemText>
        </ListItemButton>
        <ListItemButton component={Link} to={'/grey-2-color'}>
            <ListItemIcon>
                <ImageIcon />
            </ListItemIcon>
            <ListItemText>Grey To Color</ListItemText>
        </ListItemButton>
        <ListItemButton component={Link} to={'/horizontal-scrollable-gallery'}>
            <ListItemIcon>
                <CollectionsIcon />
            </ListItemIcon>
            <ListItemText>Horizontal Gallery</ListItemText>
        </ListItemButton>
        <ListItemButton component={Link} to={'/vertical-scrollable-gallery'}>
            <ListItemIcon>
                <CollectionsIcon />
            </ListItemIcon>
            <ListItemText>Vertical Gallery</ListItemText>
        </ListItemButton>
    </List>
);