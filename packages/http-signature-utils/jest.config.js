'use strict'
// eslint-disable-next-line @typescript-eslint/no-var-requires
const baseConfig = require('../../jest.config.base.js')
// eslint-disable-next-line @typescript-eslint/no-var-requires
const packageName = 'http-signature-utils'

const esModules = ['httpbis-digest-headers', 'structured-headers']

module.exports = {
  ...baseConfig,
  clearMocks: true,
  roots: [`<rootDir>/packages/${packageName}`],
  testRegex: `(packages/${packageName}/.*/__tests__/.*|\\.(test|spec))\\.tsx?$`,
  moduleDirectories: [`node_modules`, `packages/${packageName}/node_modules`],
  modulePaths: [`<rootDir>/packages/${packageName}/src/`],
  transformIgnorePatterns: [`node_modules/(?!.pnpm|${esModules.join('|')})`],
  id: packageName,
  displayName: packageName,
  rootDir: '../..'
}
