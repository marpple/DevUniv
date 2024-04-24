import { join, resolve } from 'node:path';

/**
 * @type {import('@rune-ts/server').RuneConfigType}
 */
export default {
  port: 5001,
  hostname: 'localhost',
  mode: 'render',
  sassOptions: {
    includePaths: [join(resolve(), '../../packages/styles')],
    additionalData: `@import "base";`,
  },
  clientEntry: './src/app/client/index.ts',
  serverEntry: './src/app/server/index.ts',
  watchToReloadPaths: ['../../packages'],
  watchToIgnorePaths: ['**/.env.*', '*.json'],
};
