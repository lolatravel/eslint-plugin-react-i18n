"use strict";

const noDynamicTranslationKeys = require("./rules/no-dynamic-translation-keys");
const noMissingInterpolationKeys = require("./rules/no-missing-interpolation-keys");
const noStringLiteral = require("./rules/no-string-literal");

module.exports = {
  rules: {
    "no-dynamic-translation-keys": noDynamicTranslationKeys,
    "no-missing-interpolation-keys": noMissingInterpolationKeys,
    "no-string-literal": noStringLiteral
  },
  configs: {
    recommended: {
      plugins: ["react-i18n"],
      parserOptions: {
        ecmaFeatures: {
          jsx: true
        }
      },
      rules: {
        "no-dynamic-translation-keys": "error",
        "no-missing-interpolation-keys": "error",
        "no-string-literal": "error"
      }
    }
  }
};
