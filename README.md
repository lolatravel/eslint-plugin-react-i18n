# eslint-plugin-react-i18n

[![Build Status](https://travis-ci.org/lolatravel/eslint-plugin-react-i18n.svg?branch=master)](https://travis-ci.org/lolatravel/eslint-plugin-react-i18n) [![npm version](https://img.shields.io/npm/v/eslint-plugin-react-i18n)](https://www.npmjs.com/package/eslint-plugin-react-i18n)

ESLint rules to help enforce i18n in react.

Primarily supports i18next, but happy to accept PRs to add support for other popular react i18n frameworks.

## Installation

You'll first need to install [ESLint](http://eslint.org):

```
$ npm i eslint --save-dev
```

Next, install `eslint-plugin-react-i18n`:

```
$ npm install eslint-plugin-react-i18n --save-dev
```

**Note:** If you installed ESLint globally (using the `-g` flag) then you must also install `eslint-plugin-react-i18n` globally.

## Usage

Add `react-i18n` to the plugins section of your `.eslintrc` configuration file. You can omit the `eslint-plugin-` prefix:

```json
{
  "plugins": ["react-i18n"]
}
```

Then configure the rules you want to use under the rules section.

```json
{
  "rules": {
    "react-i18n/rule-name": "error"
  }
}
```

You can also use the recommended config instead

```json
{
  "extends": ["plugin:react-i18n/recommended"]
}
```

## Supported Rules

- [react-i18n/no-dynamic-translation-keys](docs/rules/no-dynamic-translation-keys.md): Enforce using static strings as keys for translation functions
- [react-i18n/no-missing-interpolation-keys](docs/rules/no-missing-interpolation-keys.md): Enforce passing all defined interpolation keys to translation functions
