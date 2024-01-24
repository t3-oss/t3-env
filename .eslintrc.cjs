/** @type {import("eslint").Linter.Config} */
const config = {
  root: true,
  parser: "@typescript-eslint/parser",
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: [
      "./examples/*/tsconfig.json",
      "./packages/*/tsconfig.json",
      "./docs/tsconfig.json",
    ],
  },
  plugins: ["@typescript-eslint"],
  extends: [
    "plugin:@typescript-eslint/recommended",
    "plugin:@typescript-eslint/recommended-requiring-type-checking",
  ],
  rules: {
    "@typescript-eslint/no-unused-vars": [
      "error",
      {
        argsIgnorePattern: "^_",
        varsIgnorePattern: "^_",
        caughtErrorsIgnorePattern: "^_",
      },
    ],
  },
  overrides: [
    {
      files: ["**/*.test.ts"],
      rules: {
        "@typescript-eslint/no-explicit-any": "off",
        "@typescript-eslint/no-unsafe-assignment": "off",
      },
    },
  ],
  reportUnusedDisableDirectives: true,
  ignorePatterns: [
    "**/dist/**",
    "**/node_modules/**",
    ".eslintrc.cjs",
    "**/config.*",
    "replace-workspace-protocol.ts",
  ],
};

module.exports = config;
