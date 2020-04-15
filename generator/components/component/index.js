const { pascalCase, dom } = require('../../../utils');

const getRectangleStylePropeties = ({ absoluteBoundingBox, fills, strokes, strokeWeight }) => {
  const fixedNumber = number => Number(number.toFixed(2))
  const rgba = ({ r, g, b, a }) => `rgba(${fixedNumber(r)}, ${fixedNumber(g)}, ${fixedNumber(b)}, ${fixedNumber(a)})`

  const data = {
    display: 'flex',
    width: absoluteBoundingBox.width + 'px',
    height: absoluteBoundingBox.height + 'px',
  }

  if (fills.length)
    data['background-color'] = rgba(fills[0].color);

  if (strokes.length)
    data['border'] = `${ strokeWeight }px solid ${rgba(strokes[0].color)}`;

  return data;
}

module.exports = (node, traverseNode) => {
  const name = pascalCase(node.name);
  const reverseChildrens = node.children.reverse();

  let styles = [];
  let hasStyle = false;
  let content = '';

  // Create the styles of the component
  const lastChild = reverseChildrens[reverseChildrens.length - 1] || null;
  if (lastChild && lastChild.type === 'RECTANGLE') {
    reverseChildrens.pop();
    hasStyle = true;
    styles.push({ name, style: getRectangleStylePropeties(lastChild) })
  };

  // Process the childrens
  const children = reverseChildrens.map(node => traverseNode(node));
  const dependencies = children.filter(child => child.dependency).map(({ dependency }) => dependency);

  // Add the child styles to the root
  styles.push(...children.filter(child => child.style).map(({ name, style }) => ({ name, style })));

  // Process the content
  if (children.length === 1 && !hasStyle)
    content = children[0].content;
  else
    content = `(${ dom(name, children) })`;

  return { name, styles, content, children, dependencies };
}
