module.exports = {
  preset: 'ts-jest',
  moduleNameMapper: {
    "^.+\\.svelte$": "<rootDir>/test/mocks/svelte.js"
  },
  collectCoverage: true,
  testMatch: [
    '**/test/**/*.spec.ts'
  ],
  testPathIgnorePatterns: [
    '/node_modules/'
  ]
};
