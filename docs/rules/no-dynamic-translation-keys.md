# Enforce using static strings as keys for translation functions (no-dynamic-translation-keys)

When using scripts to automatically abstract translation keys into translation files (like [this babel one](https://github.com/gilbsgilbs/babel-plugin-i18next-extract)), it's usually required to have static strings passed to translation functions since the script can't guess what dynamic keys would result in at run-time.

## Rule Details

Examples of **incorrect** code for this rule:

```js
t(key);

t(...args);

t(`${status}Message`);
```

Examples of **correct** code for this rule:

```js
t("key");

t("Hi {{user}}!", { name: "User" });

t(`errorMessage`);
```

### Options

```
"react-i18n/no-dynamic-translation-keys": [<enabled>, {
  "functionNames": <array<string>>
}]
```

#### `functionNames`

By default, this rule will look at all functions named `t`. You can specify additional functions used for translation using the `functionNames` option.

Examples of **incorrect** code with this option:

```js
// ["error", { functionNames: ["translate", "customFunction"] }]

t(key);

translate(key);

utils.translate(key);

customFunction(key);
```

Examples of **correct** code with this option:

```js
// ["error", { functionNames: ["translate", "customFunction"] }]

t("key");

translate("key");

utils.translate("key");

customFunction("key");
```

## When Not To Use It

When not using scripts to automatically abstract keys into translation files.
