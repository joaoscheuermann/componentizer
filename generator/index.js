const handlers = require('./handlers');

const traverseNode = (node , depth = 0) => handlers[node.type] ? handlers[node.type](node, traverseNode) : handlers.default(node);
const fromPage = page => page.children.map(node => traverseNode(node));

module.exports = {
  fromPage,
  traverseNode,
};
