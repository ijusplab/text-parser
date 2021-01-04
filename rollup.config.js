import del from 'rollup-plugin-delete'
import typescript from 'rollup-plugin-typescript2';
import pkg from './package.json';
import {terser} from "rollup-plugin-terser";
export default {
 input: 'src/index.ts', // our source file
 output: [
  {
   file: pkg.main,
   format: 'cjs'
  },
  {
   file: pkg.module,
   format: 'es' // the preferred format
  },
  {
   file: pkg.browser,
   format: 'iife',
   name: 'TextParser' // the global which can be used in a browser
  }
 ],
 external: [
  ...Object.keys(pkg.dependencies || {})
 ],
 plugins: [
  del({ targets: 'dist/*' }),
  typescript({
   typescript: require('typescript'),
   useTsconfigDeclarationDir: true
  }),
  terser() // minifies generated bundles
 ]
};