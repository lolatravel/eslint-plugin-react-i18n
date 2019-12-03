//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const { RuleTester } = require("eslint");
const rule = require("../../../lib/rules/no-hardcoded-date-formatting");

const parsers = require("../../helpers/parsers");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ERROR_MESSAGE = "Hardcoded format used for display date formatting";

const ruleTester = new RuleTester({ parser: parsers.BABEL_ESLINT });
ruleTester.run("no-hardcoded-date-formatting", rule, {
  valid: [
    {
      code: "new Date().toISOString()"
    },
    {
      code: "new Date().toLocaleDateString('fr-FR', options)"
    },
    {
      code: "new Date().toLocaleString('fr-FR', options)"
    },
    {
      code: "new Date().toLocaleTimeString('fr-FR', options)"
    },
    {
      code: "new SomeOtherClass().toString()"
    },
    {
      code: "someVariable.toString()"
    }
  ],

  invalid: [
    {
      code: "new Date().toString()",
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
      code: "new Date().toDateString()",
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
      code: "new Date().toTimeString()",
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
      code: "return new Date().toString()",
      errors: [
        {
          message: ERROR_MESSAGE,
          line: 1,
          column: 8,
          type: "CallExpression"
        }
      ]
    },
    {
      code: "<p>new Date().toString()</p>",
      errors: [
        {
          message: ERROR_MESSAGE,
          line: 1,
          column: 0,
          type: "CallExpression"
        }
      ]
    },
    {
      code: [
        "const someDate = new Date();",
        "return someDate.toString();"
      ].join("\n"),
      errors: [
        {
          message: ERROR_MESSAGE,
          line: 2,
          column: 8,
          type: "CallExpression"
        }
      ]
    },
    {
      code: [
        "const dates = { firstDate: new Date() };",
        "return dates.firstDate.toString();"
      ].join("\n"),
      errors: [
        {
          message: ERROR_MESSAGE,
          line: 2,
          column: 8,
          type: "CallExpression"
        }
      ]
    }
  ]
});
