#!/usr/bin/env node

import serve from 'serve';

// eslint-disable-next-line no-undef
const [, , ...args] = process.argv;

// eslint-disable-next-line no-undef
console.log(`${args}`);

serve('./site');
