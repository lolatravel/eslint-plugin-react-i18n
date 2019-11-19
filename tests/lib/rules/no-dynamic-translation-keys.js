//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const { RuleTester } = require("eslint");
const rule = require("../../../lib/rules/no-dynamic-translation-keys");

const parsers = require("../../helpers/parsers");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ERROR_MESSAGE = "Dynamic value used as translation key";

const ruleTester = new RuleTester({ parser: parsers.BABEL_ESLINT });
ruleTester.run("no-dynamic-translation-keys", rule, {
  valid: [
    {
      code: "someFunction(arg)"
    },
    {
      code: "someFunction(...arg)"
    },
    {
      code: "someFunction('arg', { name: 'John' })"
    },
    {
      code: "someFunction(`arg${number}`)"
    },
    {
      code: "someFunction('myKey')",
      options: [{ functionNames: ["someFunction"] }]
    },
    {
      code: "someFunction('Hello {{name}}', { name: 'John' })",
      options: [{ functionNames: ["someFunction"] }]
    },
    {
      code: "i18n.translate('Hello {{name}}', { name: 'John' })",
      options: [{ functionNames: ["translate"] }]
    },
    {
      code: "t('myKey')"
    },
    {
      code: "t(`myKey`)"
    },
    {
      code: "t('Hi there!')"
    },
    {
      code: "t('Hi {{name}}!', { name: 'John' })"
    },
    {
      code: "t('SomeKey', { firstName: 'John', lastName: 'Smith' });"
    }
  ],

  invalid: [
    {
      code: "t(key)",
      errors: [
        {
          message: ERROR_MESSAGE,
          line: 1,
          column: 1,
          type: "CallExpression"
        }
      ]
    },
    {
      code: "t(...keys)",
      errors: [
        {
          message: ERROR_MESSAGE,
          line: 1,
          column: 1,
          type: "CallExpression"
        }
      ]
    },
    {
      code: "t('Hello' + ' there!')",
      errors: [
        {
          message: ERROR_MESSAGE,
          line: 1,
          column: 1,
          type: "CallExpression"
        }
      ]
    },
    {
      code: "t(`Hello ${name}`)",
      errors: [
        {
          message: ERROR_MESSAGE,
          line: 1,
          column: 1,
          type: "CallExpression"
        }
      ]
    },
    {
      code: "i18next.t(key)",
      errors: [
        {
          message: ERROR_MESSAGE,
          line: 1,
          column: 1,
          type: "CallExpression"
        }
      ]
    },
    {
      code: "utils.i18.next.t(key)",
      errors: [
        {
          message: ERROR_MESSAGE,
          line: 1,
          column: 1,
          type: "CallExpression"
        }
      ]
    },
    {
      code: "t(condition ? 'error' : 'success')",
      errors: [
        {
          message: ERROR_MESSAGE,
          line: 1,
          column: 1,
          type: "CallExpression"
        }
      ]
    },
    {
      code: "translate(`Hello ${name}`)",
      options: [{ functionNames: ["translate"] }],
      errors: [
        {
          message: ERROR_MESSAGE,
          line: 1,
          column: 1,
          type: "CallExpression"
        }
      ]
    },
    {
      code: "translate(greeting)",
      options: [{ functionNames: ["translate"] }],
      errors: [
        {
          message: ERROR_MESSAGE,
          line: 1,
          column: 1,
          type: "CallExpression"
        }
      ]
    },
    {
      code: "translate(...greetings)",
      options: [{ functionNames: ["translate"] }],
      errors: [
        {
          message: ERROR_MESSAGE,
          line: 1,
          column: 1,
          type: "CallExpression"
        }
      ]
    }
  ]
});
