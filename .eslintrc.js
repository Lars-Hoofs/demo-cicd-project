module.exports = {
  env: {
    browser: false,
    commonjs: true,
    es2021: true,
    node: true,
    jest: true,
  },
  extends: [
    'airbnb-base',
  ],
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module',
  },
  rules: {
    // Aangepaste regels voor dit project
    'no-console': 'warn',
    'no-unused-vars': 'error',
    'no-undef': 'error',
    'semi': ['error', 'always'],
    'quotes': ['error', 'single'],
    'indent': ['error', 2],
    'comma-dangle': ['error', 'always-multiline'],
    'max-len': ['error', { code: 120 }],
    'no-trailing-spaces': 'error',
    'eol-last': 'error',
    'object-curly-spacing': ['error', 'always'],
    'array-bracket-spacing': ['error', 'never'],
    'space-before-function-paren': ['error', 'never'],
    'keyword-spacing': ['error', { before: true, after: true }],
    'space-infix-ops': 'error',
    'no-multiple-empty-lines': ['error', { max: 2, maxEOF: 1 }],
    'prefer-const': 'error',
    'no-var': 'error',
    
    // Minder strikte regels voor demo project
    'import/no-extraneous-dependencies': ['error', { devDependencies: true }],
    'consistent-return': 'off',
    'no-param-reassign': 'off',
    'func-names': 'off',
    'no-shadow': 'off',
  },
  overrides: [
    {
      files: ['tests/**/*.js', '**/*.test.js'],
      rules: {
        'no-unused-expressions': 'off',
      },
    },
  ],
};
