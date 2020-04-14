const { pascalCase } = require('../../../utils');

module.exports = (node) => {
  const name = pascalCase(node.name);
  return { dependency: name, content: `<${name} />` };
}
