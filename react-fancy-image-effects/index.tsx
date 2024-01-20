import * as React from "react";
import * as ReactDOM from "react-dom";

import App from './App';

console.log("get element for rendering");

const el = document.getElementById("app");

console.log("render react app")

ReactDOM.render(<App />,  el);
