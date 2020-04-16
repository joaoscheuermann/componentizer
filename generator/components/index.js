const handlers = {
  COMPONENT: require('./component'),
  INSTANCE: require('./instance'),
  TEXT: require('./text'),

  default: node => {
    console.warn(`[WARN] ${node.type} is not supported`);
    return { name: 'NONE', content: '' }
  }
}

const traverseNode = (node) => handlers[node.type] ? handlers[node.type](node, traverseNode) : handlers.default(node);
const fromPage = page => page.children.reverse().map(node => traverseNode(node));

module.exports = {
  fromPage,
  traverseNode,
};
