// @ts-check
/* eslint-env node */

'use strict';

const options = {
  root: true,
  parser: 'vue-eslint-parser',
  parserOptions: {
    ecmaVersion: 2020
  },
  plugins: ['@typescript-eslint'],
  extends: [
    'eslint:recommended',
    'plugin:vue/recommended',
    'plugin:prettier-vue/recommended',
    'prettier/vue',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:vue/vue3-recommended'
  ]
};

module.exports = options;
