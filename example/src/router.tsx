import * as React from 'react';
import { createBrowserRouter } from 'react-router-dom';
import { Root } from './Root';
import {
    Home,
    FadeColumnExample,
    HorizontalScrollableGallery,
    HorizontalGreyScrollExample,
    VerticalGreyScrollExample,
    Grey2ColorExample,
    VerticalScrollableGallery,
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
                path: 'grey-2-color',
                element: <Grey2ColorExample />,
            },
            {
                path: "horizontal-grey-scroll",
                element: <VerticalGreyScrollExample />,
            },
            {
                path: "horizontal-scrollable-gallery",
                element: <HorizontalScrollableGallery />
            },
            {
                path: "vertical-scrollable-gallery",
                element: <VerticalScrollableGallery />
            }
        ],
    },
]);