module.exports = {
  "extends": "eslint:recommended",
  "parserOptions": {
    "ecmaVersion": 8,
    "sourceType": "module",
  },
  "env": {
    "node": true,
  },
  "rules": {
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'standard/no-callback-literal': 'off',
    'space-before-function-paren': ['error', 'never'],
    "comma-dangle": ["error", "always-multiline"],
  },
}
