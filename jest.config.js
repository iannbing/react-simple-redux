const React = require('react');

module.exports = {
  verbose: true,
  transform: { '^.+\\.[t|j]sx?$': 'babel-jest' },
  globals: {
    react: React,
  },
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  collectCoverage: true,
  coverageDirectory: 'reports',
  coverageReporters: ['lcov', 'text'],
  reporters: [
    'default',
    [
      'jest-junit',
      {
        suiteName: 'jest tests',
        suiteNameTemplate: '{filepath}',
        output: 'reports/junit.xml',
        classNameTemplate: '{filename}',
        titleTemplate: '{title}',
        ancestorSeparator: ' > ',
      },
    ],
  ],
  setupFilesAfterEnv: ['./jest.setup.js'],
  collectCoverageFrom: [
    'src/**/*.{ts,tsx,js,jsx}',
    '!<rootDir>/jest.config',
    '!<rootDir>/jest.setup',
    '!<rootDir>/src/index.tsx',
  ],
};
