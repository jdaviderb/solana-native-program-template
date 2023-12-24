/** @type {import('ts-jest').JestConfigWithTsJest} */

module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  globalSetup: './setup.ts',
  globalTeardown: './down.ts'
};
