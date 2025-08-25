import { terser } from "rollup-plugin-terser";
import { babel } from "@rollup/plugin-babel";
import commonjs from "@rollup/plugin-commonjs";
import replace from "@rollup/plugin-replace";
import postcss from "rollup-plugin-postcss";
import autoprefixer from "autoprefixer";
import json from "@rollup/plugin-json";
import glslify from "rollup-plugin-glslify";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import copy from "rollup-plugin-copy";
import dotenv from "dotenv";

dotenv.config();

const ENV_VALUES =  {
  'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
  'process.env.GA_MEASUREMENT_ID': JSON.stringify(process.env.GA_MEASUREMENT_ID),
  'process.env.GA_API_SECRET': JSON.stringify(process.env.GA_API_SECRET),
  'process.env.GA_ENDPOINT': JSON.stringify(process.env.GA_ENDPOINT),
}

export default [
  {
    input: "src/scripts/contentScript.js",
    output: {
      file: "build/contentScript.js",
      format: "cjs",
      plugins: [terser()],
    },
  },
  {
    input: "src/scripts/background.js",
    output: {
      file: "build/background.js",
      format: "cjs",
      plugins: [terser()],
    },
  },
  {
    input: "src/scripts/popup.js",
    output: {
      file: "build/popup.js",
      format: "cjs",
      plugins: [terser()],
    },
    plugins: [
      // eslint-disable-next-line no-undef
      process.env.NODE_ENV === "production" && terser(),
      babel({
        exclude: "node_modules/**",
        babelHelpers: "bundled",
        presets: ["@babel/env", "@babel/preset-react"],
        extensions: [".js"],
      }),
      nodeResolve({
        browser: true,
        modulePaths: ["node_modules/@tensorflow/**"],
      }),
      commonjs({
        include: ["node_modules/**"],
        requireReturnsDefault: true,
      }),
      json(),
      glslify(),
      replace({
        preventAssignment: true,
        values: {...ENV_VALUES}
      }),
      postcss({
        plugins: [autoprefixer()],
      }),
    ],
  },
  {
    input: "src/scripts/inject.js",
    output: {
      file: "build/inject.js",
      format: "cjs",
    },
    plugins: [
      // eslint-disable-next-line no-undef
      process.env.NODE_ENV === "production" && terser(),
      babel({
        exclude: "node_modules/**",
        babelHelpers: "bundled",
        presets: ["@babel/env", "@babel/preset-react"],
        extensions: [".js"],
      }),
      nodeResolve({
        browser: true,
        modulePaths: ["node_modules/@tensorflow/**"],
      }),
      commonjs({
        include: ["node_modules/**"],
        requireReturnsDefault: true,
      }),
      json(),
      glslify(),
      replace({
        preventAssignment: true,
        values: {...ENV_VALUES}
      }),
      copy({
        targets: [
          { src: "src/models/*", dest: "build" },
          { src: "src/views/*", dest: "build" },
          { src: "src/external_scripts/*", dest: "build" },
        ],
      }),
    ],
  },
  {
    input: "src/scripts/options.js",
    output: {
      file: "build/options.js",
      format: "cjs",
    },
    plugins: [
      // eslint-disable-next-line no-undef
      process.env.NODE_ENV === "production" && terser(),
      babel({
        exclude: "node_modules/**",
        babelHelpers: "bundled",
        presets: ["@babel/env", "@babel/preset-react"],
        extensions: [".js"],
      }),
      nodeResolve({
        browser: true,
        modulePaths: ["node_modules/@tensorflow/**"],
      }),
      commonjs({
        include: ["node_modules/**"],
        requireReturnsDefault: true,
      }),
      json(),
      glslify(),
      replace({
        preventAssignment: true,
        values: {...ENV_VALUES}
      }),
      postcss({
        plugins: [autoprefixer()],
      }),
    ],
  },
];
