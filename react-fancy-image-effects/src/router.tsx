import * as React from 'react';
import { createBrowserRouter } from 'react-router-dom';
import { Root } from './Root';
import {
    Home,
    FadeColumnExample,
    HorizontalScrollableGallery,
    HorizontalGreyScrollExample,
    VerticalGreyScrollExample,
} from './pages';

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
                path: "vertical-grey-scroll",
                element: <VerticalGreyScrollExample />,
            },
            {
                path: "horizontal-grey-scroll",
                element: <HorizontalGreyScrollExample />,
            },
            {
                path: "horizontal-grey-scroll",
                element: <VerticalGreyScrollExample />,
            },
            {
                path: "horizontal-scrollable-gallery",
                element: <HorizontalScrollableGallery />
            }
        ],
    },
]);