/* eslint-disable @typescript-eslint/no-var-requires, no-undef, import/no-extraneous-dependencies */
module.exports = {
  root: true,
  env: {
    node: true
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2020,
    project: './tsconfig.json'
  },
  extends: [
    'airbnb-typescript/base',
    'plugin:@typescript-eslint/recommended',
    '@feather-ink/eslint-config-shareable'
  ],
  plugins: [
    'import',
    'node',
    'promise'
  ]
}
