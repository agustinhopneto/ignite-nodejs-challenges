export default {
  clearMocks: true,
  coverageProvider: "v8",
  testEnvironment: "node",
  preset: 'ts-jest',
  testMatch: [
    '**/*.spec.ts',
  ],
  bail: true,
};
