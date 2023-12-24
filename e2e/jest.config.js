/** @type {import('ts-jest').JestConfigWithTsJest} */

module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  setupTestFrameworkScriptFile: './solana-test-framework-setup.ts',
  globalSetup: './setup.ts',
  globalTeardown: './down.ts',
  globals: {
    ok: 2
  }
};
