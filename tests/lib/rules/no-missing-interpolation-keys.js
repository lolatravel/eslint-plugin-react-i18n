//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const { RuleTester } = require("eslint");
const rule = require("../../../lib/rules/no-missing-interpolation-keys");

const parsers = require("../../helpers/parsers");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ERROR_MESSAGE = "Missing key in interpolation function";

const ruleTester = new RuleTester({ parser: parsers.BABEL_ESLINT });
ruleTester.run("no-missing-interpolation-keys", rule, {
  valid: [
    {
      code: "t('Some text');"
    },
    {
      code: "t('SomeKey', { firstName: 'John', lastName: 'Smith' });"
    },
    {
      code: "t(`Some text`);"
    },
    {
      code: "t(`${value} under`);"
    },
    {
      code: "t('Hi {{name}}', { name: 'Bob' });"
    },
    {
      code: "t('Hi {{name}}', { name: 'Bob', someOtherKey: 'not needed' });"
    },
    {
      code: "t('Hi {{name}}', user);"
    },
    {
      code:
        "t('Hi {{firstName}} {{lastName}}', { ...user, lastName: 'Smith' });"
    },
    {
      code: "someFunction('Hi {{name}}', { name: 'Bob' });",
      options: [{ functionNames: ["someFunction"] }]
    },
    {
      code: "t('Hi [[name]] {{somethingElse}}', { name: 'Bob' });",
      options: [{ prefix: "[[", suffix: "]]" }]
    },
    {
      code:
        "t('Hi {{firstName}} {{lastName}}', { firstName: 'John', lastName: 'Smith' });"
    },
    {
      code: "t('With {{ spaces }}', { spaces: 'spaces' });"
    },
    {
      code: "someFunction('Hi {{name}}');"
    },
    {
      code: "const message = 'Hi {{name}}';"
    }
  ],

  invalid: [
    {
      code: "t('Hi {{name}}');",
      errors: [
        {
          message: ERROR_MESSAGE,
          line: 1,
          column: 3,
          type: "Literal"
        }
      ]
    },
    {
      code: "t('Hi {{firstName}} {{lastName}}', { firstName: 'John' });",
      errors: [
        {
          message: ERROR_MESSAGE,
          line: 1,
          column: 3,
          type: "Literal"
        }
      ]
    },
    {
      code: "t('Hi [[name]]');",
      options: [{ prefix: "[[", suffix: "]]" }],
      errors: [
        {
          message: ERROR_MESSAGE,
          line: 1,
          column: 3,
          type: "Literal"
        }
      ]
    },
    {
      code: "someFunction('Hi {{name}}');",
      options: [{ functionNames: ["someFunction"] }],
      errors: [
        {
          message: ERROR_MESSAGE,
          line: 1,
          column: 14,
          type: "Literal"
        }
      ]
    },
    {
      code: "t(`Hi {{name}}`);",
      errors: [
        {
          message: ERROR_MESSAGE,
          line: 1,
          column: 3,
          type: "TemplateLiteral"
        }
      ]
    }
  ]
});
