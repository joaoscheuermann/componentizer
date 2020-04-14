const { pascalCase, dom } = require('../../../utils');

module.exports = (node, traverseNode) => {
  const name = pascalCase(node.name);

  // If doesnt exist process the component
  // const isLastChildRectangle = isRectangle(node.children[node.children.length - 1]);
  // const lastChild = isLastChildRectangle ? node.children.pop() : null;

  // if (lastChild) {
  //     console.log('has last child as a rect')
  // }

  const children = node.children.map(node => traverseNode(node));
  const style = null;
  const styles = children.filter(child => child.style).map(({ name, style }) => ({ name, style }));
  const dependencies = children.filter(child => child.dependency).map(({ dependency }) => dependency);

  let content = '';

  if (0 < children.length <= 1)
    content = children[0].content;
  else
    content = `(${ dom(name, children) })`;

  return { name, styles, content, children, dependencies };
}
