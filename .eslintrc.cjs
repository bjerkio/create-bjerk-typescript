/** @type {import('eslint').Linter.Config} */
module.exports = {
  extends: ['@bjerk/eslint-config', 'plugin:jest/recommended'],
  plugins: ['jest'],
  ignorePatterns: ['dist', 'node_modules', 'coverage'],
  overrides: [
    {
      files: 'jest.config.*',
      rules: {
        'import/no-default-export': 'off',
      },
    },
  ],
  parserOptions: {
    project: true,
    tsconfigRootDir: __dirname,
  },
};
