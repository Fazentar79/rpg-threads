module.exports = {
    root: true,
    env: {browser: true, es2020: true},
    extends: [
        'eslint:recommended',
        'plugin:react/recommended',
        'plugin:react/jsx-runtime',
        'plugin:react-hooks/recommended',
        'plugin:jsx-a11y/recommended',
        'plugin:prettier/recommended',
        'prettier'
    ],
    ignorePatterns: ['dist', '.eslintrc.cjs'],
    parserOptions: {
        ecmaVersion: 'latest', ecmaFeatures: {
            'jsx': true
        }, sourceType: 'module'
    },
    settings: {react: {version: '18.2'}},
    plugins: ['react-refresh', 'jsx-a11y', 'react-hooks', 'prettier'],
    rules: {
        'react-refresh/only-export-components': [
            'warn',
            {allowConstantExport: true},
        ],
        'no-use-before-define': ['warn'],
        'no-unused-vars': ['warn', {
            'argsIgnorePattern': '^_',
            'varsIgnorePattern': '^_',
            'caughtErrorsIgnorePattern': '^_'
        }],
        'react/prop-types': 'off',
        'react-hooks/rules-of-hooks': 'error',
        'react-hooks/exhaustive-deps': 'warn',
        'default-case': 'error',
        'camelcase': 'warn',
        'no-async-promise-executor': 'error',
        'no-await-in-loop': 'error',
        'no-console': 'warn',
        'no-misleading-character-class': 'error',
        'no-multi-assign': 'error',
        'no-multi-str': 'error',
        'no-nested-ternary': 'error',
        'no-new': 'error',
        'no-new-symbol': 'error',
        'no-new-wrappers': 'error',
        'no-obj-calls': 'error',
        'no-octal-escape': 'error',
        'no-script-url': 'error',
        'no-self-compare': 'error',
        'no-sequences': 'error',
        'no-shadow-restricted-names': 'error',
        'no-sparse-arrays': 'error',
        'no-template-curly-in-string': 'error',
        'no-this-before-super': 'error',
        'prefer-numeric-literals': 'error',
        'prefer-object-spread': 'error',
        'prefer-rest-params': 'error',
        'prefer-spread': 'error',
        'prefer-template': 'error',
        'symbol-description': 'error',
        'no-unreachable-loop': 'error',
        'react/no-unescaped-entities': 0,
        'react/react-in-jsx-scope': 0,
        'prettier/prettier': [
            'warn',
            {
                'endOfLine': 'auto',
                'singleQuote': true
            }
        ]
    },
}