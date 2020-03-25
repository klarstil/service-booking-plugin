module.exports = {
    env: {
        browser: true,
        es6: true,
    },

    globals: {
        Shopware: true
    },

    plugins: ['import'],

    parserOptions: {
        ecmaVersion: 2018,
        sourceType: 'module'
    },

    rules: {
        'use-isnan': ['error'],
        'curly': ['error', 'all'],
        'array-callback-return': ['error'],
        'arrow-parens': ['error', 'always'],
        'quotes': ['error', 'single'],
        'no-unused-vars': ['error'],
        'no-console': ['error', { allow: ["error"]}],
        'comma-dangle': ['error', 'always-multiline'],
        'no-multiple-empty-lines': ['error', { max: 1 }],
        'padded-blocks': ['error', 'never'],
        'semi': ['error', 'always'],
        'no-useless-return': ['error'],

        'import/no-useless-path-segments': ['warn', { noUselessIndex: true }],
        'max-len': [ 'warn', 125, { 'ignoreRegExpLiterals': true } ],
        'consistent-return': ['warn'],
        'eol-last': ['warn'],
        'array-bracket-spacing': ['warn', 'never'],
        'object-curly-spacing': ['warn', 'always'],
        'comma-spacing': ['warn', {"before": false, "after": true}],
        'keyword-spacing': ['error'],
    }
};
