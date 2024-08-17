import babel from "@rollup/plugin-babel";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import commonjs from '@rollup/plugin-commonjs';
import wasm from "@rollup/plugin-wasm";
import typescript from "@rollup/plugin-typescript";
import { dts } from "rollup-plugin-dts";
import peerDepsExternal from 'rollup-plugin-peer-deps-external';

export default [
    {
    input: "src/index.ts",
    output: [
        {
            file: "dist/cjs/index.js",
            format: "cjs",
            sourcemap: true,
        },
        {
            file: "dist/esm/index.js",
            format: "esm",
            sourcemap: true,
        }
    ],
    plugins: [
        peerDepsExternal(),
        nodeResolve({
            extensions: [".ts", ".tsx"],
        }),
        commonjs(),
        babel({
            babelHelpers: "bundled",
            exclude: "node_modules/**",
            extensions: [".ts", ".tsx"],
            presets: ["@babel/preset-typescript", ["@babel/preset-react", { "runtime": "automatic" }]],
        }),
        wasm(),
    ],
},
    {
        input: "src/index.ts",
        output: {
            file: "dist/ts/index.js",
            format: "esm",
            sourcemap: true,
        },
        plugins: [
            typescript({
               tsconfig: "tsconfig.json",
            })
        ],
    },
    {
        input: "./dist/ts/index.d.ts",
        output: [{ file: "dist/index.d.ts", format: "es" }],
        plugins: [dts()],
    },
]