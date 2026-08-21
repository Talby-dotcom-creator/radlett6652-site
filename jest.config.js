const { createDefaultPreset } = require("ts-jest");

const tsJestTransformCfg = createDefaultPreset().transform;

/** @type {import("jest").Config} **/
module.exports = {
  testEnvironment: "jsdom",
  transform: {
    ...tsJestTransformCfg,
  },
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
  moduleNameMapper: {
    "^(?:\\.\\./)+lib/supabase$": "<rootDir>/__mocks__/supabase.ts",
    "^\\./getSupabaseEnv$": "<rootDir>/__mocks__/getSupabaseEnv.ts",
    "^(?:\\.\\./)+lib/getSupabaseEnv$":
      "<rootDir>/__mocks__/getSupabaseEnv.ts",
  },
};
