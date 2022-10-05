import { terser } from "rollup-plugin-terser";

export default [
  {
    input: "src/scripts/contentScript.js",
    output: {
      file: "build/contentScript.js",
      format: "cjs",
      plugins: [terser()],
      format: "iife",
    },
  },
  {
    input: "src/scripts/background.js",
    output: {
      file: "build/background.js",
      format: "cjs",
      plugins: [terser()],
      format: "iife",
    },
  },
  {
    input: "src/scripts/popup.js",
    output: {
      file: "build/popup.js",
      format: "cjs",
      plugins: [terser()],
      format: "iife",
    },
  },
  {
    input: "src/scripts/inject.js",
    output: {
      file: "build/inject.js",
      format: "cjs",
      plugins: [terser()],
      format: "iife",
    },
  },
];
