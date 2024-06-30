import * as React from "react";
import { createRoot } from "react-dom/client";

import App from './src/App';

const el = document.getElementById("app");
const root = createRoot(el);
root.render(<App />);
