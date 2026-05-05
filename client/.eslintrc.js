/**
 * ESLint Configuration
 */

module.exports = {
  extends: ['react-app', 'react-app/jest'],
  rules: {
    '@typescript-eslint/no-unused-vars': [
      'warn',
      {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
      },
    ],
    '@typescript-eslint/explicit-function-return-types': [
      'warn',
      {
        allowExpressions: true,
      },
    ],
  },
};
