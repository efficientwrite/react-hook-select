import typescriptPlugin from "@rollup/plugin-typescript";
import copy from "rollup-plugin-copy";
import { terser } from "rollup-plugin-terser";

const config = {
  input: "src/ReactHookSelect.tsx",
  output: {
    file: "dist/index.js",
    format: "cjs",
    exports: "default",
  },
  external: ["react"],
  plugins: [
    typescriptPlugin({
      tsconfig: "./tsconfig.json",
    }),
    copy({
      targets: [{ src: "src/styles.scss", dest: "dist" }],
    }),
    terser(),
  ],
};

export default config;
