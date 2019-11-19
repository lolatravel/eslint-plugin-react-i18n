"use strict";

function getValueFromNode(node) {
  if (
    node.type === "TemplateLiteral" &&
    Array.isArray(node.quasis) &&
    node.quasis[0] &&
    node.quasis[0].value &&
    node.quasis[0].value.raw
  ) {
    return node.quasis[0].value.raw;
  }

  return node.value;
}

module.exports = {
  getValueFromNode
};
