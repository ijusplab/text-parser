// @ts-check
/* eslint-env node */

const configuration = {
  preset: 'ts-jest',
  collectCoverageFrom: ['src/**/**', '!src/index.ts', '!src/*/index.ts']
};

module.exports = configuration;
