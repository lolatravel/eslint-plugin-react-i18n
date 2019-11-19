# Enforce passing all defined interpolation keys to translation functions (no-missing-interpolation-keys)

When using values as translation keys, this rule makes sure all interpolation keys are passed as the second argument of the translation function.

## Rule Details

Examples of **incorrect** code for this rule:

```js
t("Hi {{name}}!");
```

Examples of **correct** code for this rule:

```js
t("Hi {{name}}!", { name: "John" });

t("greetingText", { name: "John" });

t("greetingText");
```

### Options

```
"react-i18n/no-missing-interpolation-keys": [<enabled>, {
  "functionNames": <array<string>>,
  "prefix": <string>,
  "suffix": <string>
}]
```

#### `functionNames`

By default, this rule will look at all functions named `t`. You can specify additional functions used for translation using the `functionNames` option.

Examples of **incorrect** code with this option:

```js
// ["error", { functionNames: ["translate", "customFunction"] }]

t("Hi {{name}}!");

translate("Hi {{name}}!");

utils.translate("Hi {{name}}!");

customFunction("Hi {{name}}!");
```

Examples of **correct** code with this option:

```js
// ["error", { functionNames: ["translate", "customFunction"] }]

t("Hi {{name}}!", { name: "John" });

translate("Hi {{name}}!", { name: "John" });

utils.translate("Hi {{name}}!", { name: "John" });

customFunction("Hi {{name}}!", { name: "John" });
```

#### `prefix`/`suffix`

By default, this rule will look for interpolation keys wrapped by `{{` and `}}` inside the string. You can override this to specify a different prefix/suffix with this option.

Examples of **incorrect** code with this option:

```js
// ["error", { prefix: "[[", suffix: "]]" }]

t("Hi [[name]]!");
```

Examples of **correct** code with this option:

```js
// ["error", { prefix: "[[", suffix: "]]" }]

t("Hi [[name]]!", { name: "John" });
```

## When Not To Use It

When not using values as translation keys.
