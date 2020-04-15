const { pascalCase, dom } = require('../../../utils');

module.exports = (node) => {
  const name = pascalCase(node.name);

  const style = { 
    'font-family': node.style.fontFamily,
    'font-weight': node.style.fontWeight,
    'font-size': node.style.fontSize + 'px',
    'line-height': Math.round(node.style.lineHeightPx) + 'px',
  };

  const content = dom(name, node.characters);

  return { name, style, content }
}
