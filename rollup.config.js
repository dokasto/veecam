import { terser } from "rollup-plugin-terser";
import resolve from "@rollup/plugin-node-resolve";
import { babel } from "@rollup/plugin-babel";
import commonjs from "@rollup/plugin-commonjs";
import replace from "@rollup/plugin-replace";
import postcss from "rollup-plugin-postcss";
import autoprefixer from "autoprefixer";
import json from "@rollup/plugin-json";
import glslify from "rollup-plugin-glslify";

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
      plugins: [terser()],
    },
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
      resolve(),
      babel({
        exclude: "node_modules/**",
        babelHelpers: "bundled",
        presets: ["@babel/env", "@babel/preset-react"],
        extensions: [".js"],
      }),
      commonjs({
        include: ["node_modules/**"],
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
