import * as React from 'react';
import { createBrowserRouter } from 'react-router-dom';
import { Root } from './Root';
import { Home, FadeColumnExample, HorizontalScrollableGallery } from './pages';

export const router = createBrowserRouter([
    {
        path: "/",
        element: <Root />,
        children: [
            {
                index: true,
                element: <Home />
            },
            {
                path: "fade-by-column",
                element: <FadeColumnExample />
            },
            {
                path: "horizontal-scrollable-gallery",
                element: <HorizontalScrollableGallery />
            }
        ],
    },
]);