const { defaults } = require("jest-config");

module.exports = {
  globals: {
    "ts-jest": {
      babelConfig: true,
    },
  },
  testMatch: ["<rootDir>/src/**/*.test.{js,ts}"],
  setupFiles: ["dotenv/config"],
  collectCoverageFrom: [
    "src/**/*.ts",
    "!src/**/index.ts",
    "!src/ProviderClient.ts",
  ],
  moduleFileExtensions: [...defaults.moduleFileExtensions, "ts"],
  testEnvironment: "node",
  clearMocks: true,
  collectCoverage: true,
};
