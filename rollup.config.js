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
        // eslint-disable-next-line no-undef
        "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV),
      }),
      copy({
        targets: [{ src: "src/models/*", dest: "build" }],
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
        // eslint-disable-next-line no-undef
        "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV),
      }),
      postcss({
        plugins: [autoprefixer()],
      }),
    ],
  },
];
