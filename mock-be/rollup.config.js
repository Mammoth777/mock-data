import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
export default {
	input: 'index.js',
	output: {
		file: '../target/bundle.cjs',
		format: 'cjs'
	},
  plugins: [
    resolve({
      preferBuiltins: true
    }),
    commonjs(),
    json()
  ],
  external: [
    'fs',
    'path',
    'http',
    'better-sqlite3',
    'express',
    'body-parser'
  ]
};