const { pascalCase, dom } = require('../../../utils');

module.exports = (node, traverseNode) => {
  const name = pascalCase(node.name);

  const { fontFamily, fontWeight, fontSize, lineHeightPx: lineHeight } = node.style;
  const style = { fontFamily, fontWeight, fontSize, lineHeight };
  const content = dom(name, node.characters);

  return { name, style, content }
}
