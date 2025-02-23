module.exports = {
  root: true,
  env: {
    es6: true,
    node: true
  },
  extends: [
    'eslint:recommended',
    'plugin:import/errors',
    'plugin:import/warnings',
    'plugin:import/typescript',
    'google',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: ['./tsconfig.json', './tsconfig.dev.json'],
    sourceType: 'module',
    tsconfigRootDir: __dirname
  },
  ignorePatterns: [
    '/lib/**/*', // Ignore built files.
    '/generated/**/*', // Ignore generated files.
    '**/.eslintrc.js' // Ignore this file
  ],
  plugins: ['@typescript-eslint', 'import'],
  rules: {
    quotes: ['error', 'double'],
    'import/no-unresolved': 0,
    indent: ['error', 2],
    'max-len': ['error', { code: 120 }],
    'linebreak-style': ['error', 'unix'],
    'prettier/prettier': ['error', {
      endOfLine: 'lf'
    }]
  }
};
