"use strict";

const { getValueFromNode } = require("../utils");

const ERROR_MESSAGE = "String literal not allowed";

const COMPARISON_OPERATORS = ["===", "!==", "==", "!=", "<", ">", "<=", ">="];
const IGNORE_COMPONENT_NAMES = ["Trans"];
const IGNORED_CLASS_PROPERTIES = ["displayName"];
const IGNORED_FUNCTIONS = ["require", "t"];
const IGNORE_OBJECT_KEYS = ["id", "key"];
const IGNORED_NATIVE_FUNCTIONS = [
  "includes",
  "startsWith",
  "endsWith",
  "indexOf",
  "lastIndexOf",
  "join",
  "split",
  "replace"
];
const IGNORED_FUNCTIONS_OBJECTS = [
  {
    functions: [
      "getElementById",
      "getElementsByClassName",
      "getElementsByTagName",
      "querySelector",
      "querySelectorAll",
      "createElement"
    ],
    objects: ["document"]
  },
  {
    functions: ["postMessage", "addEventListener", "removeEventListener"],
    objects: ["window"]
  },
  {
    functions: [
      "mark",
      "measure",
      "clearMarks",
      "getEntriesByName",
      "getEntriesByType",
      "clearMeasures"
    ],
    objects: ["performance"]
  },
  {
    functions: ["getItem", "setItem"],
    objects: ["localStorage"]
  },
  {
    functions: [
      "DateTimeFormat",
      "NumberFormat",
      "ListFormat",
      "RelativeTimeFormat"
    ],
    objects: ["Intl"]
  },
  {
    functions: ["createElement"],
    objects: ["React"]
  }
];

const BUTTON_IGNORED_ATTRIBUTES = ["type", "for", "form", "name"];
const INPUT_IGNORED_ATTRIBUTES = [
  "type",
  "autoComplete",
  "form",
  "name",
  "tabIndex",
  "list",
  "minLength",
  "maxLength",
  "size",
  "pattern",
  "min",
  "max",
  "step"
];
const LINK_IGNORED_ATTRIBUTES = ["target", "rel", "to"];

const IGNORED_JSX_ATTRIBUTES = [
  "id",
  "className",
  "tabIndex",
  "aria-labelledby",
  "style",
  "styles",
  "role",
  "key"
];
const IGNORED_JSX_ATTRIBUTES_PATTERN = /.+(ClassName|Style|Styles)/g;
const FLAGGED_JSX_ATTRIBUTES = [
  "aria-label",
  "aria-placeholder",
  "aria-valuetext",
  "title"
];
const FLAGGED_JSX_ATTRIBUTES_AND_ELEMENTS = [
  {
    attributes: ["value"],
    elements: ["button"]
  },
  {
    attributes: ["alt"],
    elements: ["img"]
  },
  {
    attributes: ["value", "placeholder"],
    elements: ["input"]
  },
  {
    attributes: ["label"],
    elements: ["option"]
  },
  {
    attributes: ["placeholder"],
    elements: ["textarea"]
  }
];

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = {
  meta: {
    docs: {
      description: "Enforce translation of user displayable strings",
      category: "Best practices",
      recommended: false
    },
    fixable: null,
    schema: [
      {
        type: "object",
        properties: {
          ignoreFunctionsOnObjects: {
            type: "array",
            items: {
              type: "object",
              properties: {
                functions: {
                  type: "array",
                  items: {
                    type: "string"
                  }
                },
                objects: {
                  type: "array",
                  items: {
                    type: "string"
                  }
                }
              }
            }
          },
          ignoreAttributesOnElements: {
            type: "array",
            items: {
              type: "object",
              properties: {
                attributes: {
                  type: "array",
                  items: {
                    type: "string"
                  }
                },
                elements: {
                  type: "array",
                  items: {
                    type: "string"
                  }
                }
              }
            }
          },
          ignoreAttributes: {
            type: "array",
            items: {
              type: "string"
            }
          },
          ignoreFunctions: {
            type: "array",
            items: {
              type: "string"
            }
          },
          ignoreObjectKeys: {
            type: "array",
            items: {
              type: "string"
            }
          },
          buttonComponents: {
            type: "array",
            items: {
              type: "string"
            }
          },
          inputComponents: {
            type: "array",
            items: {
              type: "string"
            }
          },
          linkComponents: {
            type: "array",
            items: {
              type: "string"
            }
          }
        },
        additionalProperties: false
      }
    ]
  },

  create(context) {
    const options = context.options[0] || {};
    const ignoreFunctions = options.ignoreFunctions || [];
    const ignoreFunctionsOnObjects = options.ignoreFunctionsOnObjects || [];
    const ignoreAttributesOnElements = options.ignoreAttributesOnElements || [];
    const ignoreAttributes = options.ignoreAttributes || [];
    const ignoreObjectKeys = options.ignoreObjectKeys || [];
    const buttonComponents = options.buttonComponents || [];
    const inputComponents = options.inputComponents || [];
    const linkComponents = options.linkComponents || [];

    const visited = new WeakSet();

    //----------------------------------------------------------------------
    // Helpers
    //----------------------------------------------------------------------

    function isUpperCase(str) {
      return /^[A-Z_-]+$/.test(str);
    }

    function isFirstLetterUpperCase(str) {
      return /[A-Z]/.test(str);
    }

    function isIgnoredClassProperty(node) {
      switch (node.type) {
        case "ClassProperty":
          return node.key && IGNORED_CLASS_PROPERTIES.includes(node.key.name);
        case "AssignmentExpression":
          return (
            node.left &&
            node.left.property &&
            IGNORED_CLASS_PROPERTIES.includes(node.left.property.name)
          );
        default:
          return false;
      }
    }

    function findIgnoreCallees(ignoreCallees, callee) {
      let objectName = callee.object;
      while (objectName.property) {
        objectName = objectName.property;
        if (objectName.type === "Identifier") {
          break;
        }
      }

      return ignoreCallees.find(i => {
        const matchingObject = i.objects.includes(objectName.name);

        // If no functions passed in, ignore all functions on that object
        if (i.functions) {
          return matchingObject && i.functions.includes(callee.property.name);
        }

        return matchingObject;
      });
    }

    function isIgnoredCallee(callee) {
      switch (callee.type) {
        case "Identifier":
          return (
            IGNORED_FUNCTIONS.includes(callee.name) ||
            ignoreFunctions.includes(callee.name)
          );
        case "MemberExpression": {
          const defaultIgnore = findIgnoreCallees(
            IGNORED_FUNCTIONS_OBJECTS,
            callee
          );
          const optionIgnore = findIgnoreCallees(
            ignoreFunctionsOnObjects,
            callee
          );
          const nativeFunctionIgnore = IGNORED_NATIVE_FUNCTIONS.includes(
            callee.property.name
          );
          const ignoreFunctionsOption = ignoreFunctions.includes(
            callee.property.name
          );

          return (
            defaultIgnore ||
            optionIgnore ||
            nativeFunctionIgnore ||
            ignoreFunctionsOption
          );
        }
        case "Import":
          return true;
        default:
          return false;
      }
    }

    function isIgnoredAttribute(components, attributes, jsxTag, parent) {
      return (
        components.includes(jsxTag.name.name) &&
        attributes.includes(parent.name.name)
      );
    }

    function getNearestAncestor(node, type) {
      let temp = node.parent;
      while (temp) {
        if (temp.type === type) {
          return temp;
        }
        temp = temp.parent;
      }
      return temp;
    }

    function findIncludedAttributes(ignoreCallees, jsxTag, parent) {
      return ignoreCallees.find(
        i =>
          i.elements.includes(jsxTag.name.name) &&
          i.attributes.includes(parent.name.name)
      );
    }

    function isUrl(node) {
      const urlRegex = /^https?:\/\/|^\/\/|^tel:|^mailto:|^file:\/\//i;
      const value = getValueFromNode(node);
      return urlRegex.test(value);
    }

    //----------------------------------------------------------------------
    // Public
    //----------------------------------------------------------------------

    return {
      "AssignmentExpression :matches(Literal, TemplateLiteral)": function(
        node
      ) {
        const { parent } = node;

        if (isIgnoredClassProperty(parent)) {
          visited.add(node);
        }
      },
      "BinaryExpression > :matches(Literal, TemplateLiteral)": function(node) {
        const { parent } = node;

        // allow name === 'Android'
        if (COMPARISON_OPERATORS.includes(parent.operator)) {
          visited.add(node);
        }
      },
      ":matches(CallExpression, NewExpression) :matches(Literal, TemplateLiteral)": function(
        node
      ) {
        let temp = node.parent;
        while (temp) {
          if (
            (temp.type === "CallExpression" || temp.type === "NewExpression") &&
            isIgnoredCallee(temp.callee)
          ) {
            visited.add(node);
            return;
          }
          temp = temp.parent;
        }
      },
      "ClassProperty :matches(Literal, TemplateLiteral)": function(node) {
        const { parent } = node;

        if (isIgnoredClassProperty(parent)) {
          visited.add(node);
        }
      },
      "ExportAllDeclaration :matches(Literal, TemplateLiteral)": function(
        node
      ) {
        // Allow export * from 'mod'
        visited.add(node);
      },
      "ExportNamedDeclaration > :matches(Literal, TemplateLiteral)": function(
        node
      ) {
        // Allow export { named } from 'mod'
        visited.add(node);
      },
      "ImportDeclaration :matches(Literal, TemplateLiteral)": function(node) {
        // Allow import { abc } from 'abc'
        visited.add(node);
      },
      "JSXElement :matches(Literal, TemplateLiteral)": function(node) {
        let temp = node.parent;
        while (temp) {
          if (
            temp.openingElement &&
            temp.openingElement.type === "JSXOpeningElement" &&
            IGNORE_COMPONENT_NAMES.includes(temp.openingElement.name.name)
          ) {
            visited.add(node);
            return;
          }
          temp = temp.parent;
        }
      },
      "JSXAttribute :matches(Literal, TemplateLiteral)": function(node) {
        const parent = getNearestAncestor(node, "JSXAttribute");
        const jsxTag = getNearestAncestor(node, "JSXOpeningElement");

        const defaultFlagged = findIncludedAttributes(
          FLAGGED_JSX_ATTRIBUTES_AND_ELEMENTS,
          jsxTag,
          parent
        );
        const optionIgnore = findIncludedAttributes(
          ignoreAttributesOnElements,
          jsxTag,
          parent
        );
        const isCustomComponent = isFirstLetterUpperCase(jsxTag.name.name);
        const validHtmlAttribute =
          !FLAGGED_JSX_ATTRIBUTES.includes(parent.name.name) &&
          !defaultFlagged &&
          !isCustomComponent;

        if (validHtmlAttribute || optionIgnore) {
          visited.add(node);
        } else if (
          IGNORED_JSX_ATTRIBUTES.includes(parent.name.name) ||
          ignoreAttributes.includes(parent.name.name) ||
          parent.name.name.match(IGNORED_JSX_ATTRIBUTES_PATTERN)
        ) {
          visited.add(node);
        } else if (
          isIgnoredAttribute(
            buttonComponents,
            BUTTON_IGNORED_ATTRIBUTES,
            jsxTag,
            parent
          ) ||
          isIgnoredAttribute(
            inputComponents,
            INPUT_IGNORED_ATTRIBUTES,
            jsxTag,
            parent
          ) ||
          isIgnoredAttribute(
            linkComponents,
            LINK_IGNORED_ATTRIBUTES,
            jsxTag,
            parent
          )
        ) {
          visited.add(node);
        }
      },
      "MemberExpression > :matches(Literal, TemplateLiteral)": function(node) {
        // Allow object['some-property']
        visited.add(node);
      },
      "Property :matches(Literal, TemplateLiteral)": function(node) {
        let temp = node.parent;
        while (temp) {
          const isValidProperty = temp.type === "Property" && temp.key;
          if (
            isValidProperty &&
            (IGNORE_OBJECT_KEYS.includes(temp.key.name) ||
              ignoreObjectKeys.includes(temp.key.name))
          ) {
            visited.add(node);
            return;
          }
          if (isValidProperty && temp.key.value === node.value) {
            // Alow strings as object keys
            visited.add(node);
            return;
          }

          temp = temp.parent;
        }
      },
      "SwitchCase > :matches(Literal, TemplateLiteral)": function(node) {
        visited.add(node);
      },
      "TaggedTemplateExpression > TemplateLiteral": function(node) {
        const { parent } = node;

        if (isIgnoredCallee(parent.tag)) {
          visited.add(node);
        }
      },
      "VariableDeclarator :matches(Literal, TemplateLiteral)": function(node) {
        const declarator = getNearestAncestor(node, "VariableDeclarator");

        if (
          (isUpperCase(declarator.id.name) && isUpperCase(node.value)) ||
          (declarator.id.name && declarator.id.name.startsWith("NON_DISPLAY_"))
        ) {
          visited.add(node);
        }
      },
      ":matches(Literal, TemplateLiteral):exit": function(node) {
        // visited and passed linting
        if (visited.has(node)) {
          return;
        }

        // Allow anything that isn't a string and empty strings
        if (
          (typeof node.value === "string" && !node.value.trim()) ||
          (node.value !== undefined && typeof node.value !== "string") ||
          node.value === null
        ) {
          return;
        }

        // Allow urls
        if (isUrl(node)) {
          return;
        }

        // Allow template strings with nothing in them except one variable
        // since there's no issues with i18n and it can be used to parse
        // numbers to strings
        if (
          node.type === "TemplateLiteral" &&
          Array.isArray(node.quasis) &&
          node.quasis.every(q => !q.value.raw) &&
          Array.isArray(node.expressions) &&
          node.expressions.length <= 1
        ) {
          return;
        }

        context.report({ node, message: ERROR_MESSAGE });
      }
    };
  }
};
