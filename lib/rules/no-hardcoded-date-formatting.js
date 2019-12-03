"use strict";

const ERROR_MESSAGE = "Hardcoded format used for display date formatting";

const INVALID_NATIVE_DATE_FUNCTIONS = [
  "toString",
  "toDateString",
  "toTimeString"
];

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = {
  meta: {
    docs: {
      description: "Prevent using harcoded formats for formatting dates",
      category: "Best Practices",
      recommended: false
    },
    fixable: null,
    schema: []
  },

  create(context) {
    // const variables = [];

    //----------------------------------------------------------------------
    // Helpers
    //----------------------------------------------------------------------

    function isNativeDateInstance(node) {
      const { object } = node.callee;
      //   console.log(object);
      if (object.type === "NewExpression" && object.callee.name === "Date") {
        return true;
      }

      return true;
    }

    //----------------------------------------------------------------------
    // Public
    //----------------------------------------------------------------------

    return {
      CallExpression(node) {
        const calleeName =
          node.callee.type === "MemberExpression"
            ? node.callee.property.name
            : node.callee.name;

        // console.log(calleeName);
        // console.log("-----------------------");
        // console.log(node);

        if (
          isNativeDateInstance(node) &&
          INVALID_NATIVE_DATE_FUNCTIONS.includes(calleeName)
        ) {
          context.report({ node, message: ERROR_MESSAGE });
        }
      },

      VariableDeclaration(node) {
        console.log(context.getDeclaredVariables(node)[0].references);
        console.log("----------------------");
        console.log(context.getDeclaredVariables(node)[0].defs);
        // const { declarations } = node;
        // declarations.forEach(d => {
        //   if (d.init.type === "NewExpression" && ) {
        //       variables.push(d.init.)
        //   }
        // });
        // if (node.kind === "let" && !isInitOfForStatement(node)) {
        //   variables.push(...context.getDeclaredVariables(node));
        // }
      }
    };
  }
};
