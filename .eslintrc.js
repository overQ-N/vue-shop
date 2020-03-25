module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: [
    'plugin:vue/essential',
    '@vue/standard'
  ],
  parserOptions: {
    parser: 'babel-eslint'
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'eol-last': 0,
    'no-trailing-spaces': 0,
    'semi': 0,
    // 'singlequote':false
    'space-before-function-paren': 0 //无论是否function前加不加空格都不报错
  }
}
