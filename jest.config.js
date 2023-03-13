const nextJest = require("next/jest");
const createJestConfig = nextJest({
  dir: "./",
});

/** @type {import('jest').Config} */
const customJestConfig = {
  verbose: true,
  passWithNoTests: true,
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
  testEnvironment: "jest-environment-jsdom",
  moduleDirectories: ["node_modules", "<rootDir>/"],
  moduleNameMapper: {
    "^@/(.*)$": ["<rootDir>/$1"],
  },
  modulePathIgnorePatterns: [
    "<rootDir>/__tests__/__utils__",
    "<rootDir>/__tests__/__config__",
  ],
};

module.exports = createJestConfig(customJestConfig);
