"use strict";

const ERROR_MESSAGE = "Dynamic value used as translation key";

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = {
  meta: {
    docs: {
      description:
        "Enforce using static strings as keys for translation functions",
      category: "Best Practices",
      recommended: false
    },
    fixable: null,
    schema: [
      {
        type: "object",
        properties: {
          functionNames: {
            type: "array",
            items: {
              type: "string"
            }
          }
        }
      }
    ]
  },

  create(context) {
    const options = context.options[0] || {};
    const functionNames = options.functionNames || [];

    //----------------------------------------------------------------------
    // Public
    //----------------------------------------------------------------------

    return {
      CallExpression(node) {
        const calleeName =
          node.callee.type === "MemberExpression"
            ? node.callee.property.name
            : node.callee.name;

        if (calleeName !== "t" && !functionNames.includes(calleeName)) {
          return;
        }

        if (node.arguments[0] && node.arguments[0].type === "Literal") {
          return;
        }

        if (
          node.arguments[0] &&
          node.arguments[0].type === "TemplateLiteral" &&
          node.arguments[0].expressions.length === 0
        ) {
          return;
        }

        context.report({ node, message: ERROR_MESSAGE });
      }
    };
  }
};
