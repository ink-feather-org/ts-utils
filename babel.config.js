/* eslint-disable @typescript-eslint/no-var-requires, no-undef, import/no-extraneous-dependencies */
module.exports = {
  presets: [
    [
      '@babel/env',
      {
        modules: false
      }
    ],
    '@babel/preset-typescript'
  ],
  plugins: [
    [
      '@babel/plugin-transform-runtime',
      { corejs: 3 }
    ],
    [
      '@babel/plugin-proposal-class-properties',
      {
        onlyRemoveTypeImports: true
      }
    ]
  ],
  env: {
    test: {
      presets: ['@babel/env']
    }
  }
}
