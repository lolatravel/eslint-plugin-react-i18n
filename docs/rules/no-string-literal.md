# Enforce translation of user displayable strings (react-i18n/no-string-literal)

When working on react applications supporting multiple languages, we want to avoid hardcoding strings that will get displayed to users in any particular language.


## Rule Details

This rule validates both regular strings and template strings.

By default, the following are ignored:
- Strings passed to common JS functions (ex: `Array.includes` or `window.addEventListener`)
- Strings passed to `t`
- Paths when using `import` (ex: `import React from 'react'`)
- Strings used for comparison (ex: `status === 'error'`)
- Strings passed to HTML attributes in JSX that won't get displayed on the screen or to screen readers (ex: `<input type="email" />` or `<div aria-labelledby="label-id" />`)
- Strings passed inside components named `Trans`
- Strings passed to `displayName` properties on classes
- Strings passed to a variable that starts with `NON_DISPLAY_` (ex: `const NON_DISPLAY_STATUS = 'status'`)
- Urls

Examples of **incorrect** code for this rule:

```js
const message = 'Hi there!';

const types = ['FLIGHTS', 'HOTELS'];

const Button = () => <button type="button">Click me</button>;

const Image = () => <img src="https://google.com" alt="Google Search Page" />;
```

Examples of **correct** code for this rule:

```js
const message = t('Hi there!');

const NON_DISPLAY_TYPES = ['FLIGHTS', 'HOTELS'];

const Button = () => <button type="button">{t('Click me')}</button>;

const Image = () => <img src="https://google.com" alt={t('imageText')} />;
```

### Options

If there are any options, describe them here. Otherwise, delete this section.

## When Not To Use It

In applications that don't support multiple languages or when harcoding strings in a specific language isn't a problem.

## Further Reading

If there are other links that describe the issue this rule addresses, please include them here in a bulleted list.
