"use strict";

const ERROR_MESSAGE = "Missing key in interpolation function";

const { getValueFromNode } = require("../utils");

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = {
  meta: {
    docs: {
      description:
        "Enforce passing all defined interpolation keys to translation functions",
      category: "Possible errors",
      recommended: true
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
          },
          prefix: {
            type: "string"
          },
          suffix: {
            type: "string"
          }
        }
      }
    ]
  },

  create(context) {
    const options = context.options[0] || {};
    const functionNames = options.functionNames || [];
    const prefix = options.prefix || "{{";
    const suffix = options.suffix || "}}";

    //----------------------------------------------------------------------
    // Helpers
    //----------------------------------------------------------------------

    function escapeRegex(text) {
      return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
    }

    //----------------------------------------------------------------------
    // Public
    //----------------------------------------------------------------------

    return {
      "CallExpression > :matches(Literal, TemplateLiteral)": function(node) {
        const { parent } = node;

        if (
          !functionNames.includes(parent.callee.name) &&
          parent.callee.name !== "t"
        ) {
          return;
        }

        // If the second argument is a variable, we can't validate the presence of the keys accurately
        if (
          Array.isArray(parent.arguments) &&
          parent.arguments[1] &&
          parent.arguments[1].type === "Identifier"
        ) {
          return;
        }

        // If there is spreading inside the object, we can't validate the keys accurately
        if (
          Array.isArray(parent.arguments) &&
          parent.arguments[1] &&
          Array.isArray(parent.arguments[1].properties) &&
          parent.arguments[1].properties.find(
            p => p.type === "ExperimentalSpreadProperty"
          )
        ) {
          return;
        }

        const value = getValueFromNode(node);
        if (!value) {
          return;
        }

        const escapedPrefix = escapeRegex(prefix);
        const escapedSuffix = escapeRegex(suffix);
        const matchRegex = new RegExp(
          `${escapedPrefix}[^${escapedSuffix}]*${escapedSuffix}`,
          "g"
        );
        const rawVariables = value.match(matchRegex);
        const variables = rawVariables
          ? rawVariables.map(m =>
              m
                .replace(
                  new RegExp(`${escapedPrefix}|${escapedSuffix}`, "g"),
                  ""
                )
                .trim()
            )
          : [];

        // Assume the object of keys is always the second argument
        const argumentProperties =
          Array.isArray(parent.arguments) &&
          parent.arguments[1] &&
          Array.isArray(parent.arguments[1].properties)
            ? parent.arguments[1].properties.map(p => p.key.name)
            : [];

        variables.forEach(variable => {
          if (!argumentProperties.includes(variable)) {
            context.report({ node, message: ERROR_MESSAGE });
          }
        });
      }
    };
  }
};
