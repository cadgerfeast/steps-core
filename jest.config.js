module.exports = {
  preset: 'ts-jest',
  collectCoverage: true,
  testMatch: [
    '**/test/**/*.spec.ts'
  ],
  testPathIgnorePatterns: [
    '/node_modules/'
  ]
};
