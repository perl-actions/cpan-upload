import type { Config } from '@jest/types';
import { pathsToModuleNameMapper } from 'ts-jest';
import { compilerOptions } from './tsconfig.json';

const config: Config.InitialOptions = {
  testEnvironment: 'node',
  verbose: true,
  testMatch: ['**/__tests__/*.test.ts'],
  clearMocks: true,
  roots: ['<rootDir>'],
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, {
    prefix: '<rootDir>/',
  }),
  transform: {
    "^.+\\.m?tsx?$": [
      'ts-jest',
      {
        useESM: true,
        tsconfig: {
          ...compilerOptions,
          allowImportingTsExtensions: true,
        },
      },
    ],
  },
};
export default config;
