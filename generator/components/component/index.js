const { pascalCase, dom } = require('../../../utils');
const { add: addToCache } = require('../../cache');

const getRectangleStylePropeties = ({ absoluteBoundingBox, fills, strokes, strokeWeight }) => {
  const fixedNumber = number => Number(number.toFixed(2))
  const rgba = ({ r, g, b, a }) => `rgba(${fixedNumber(r * 255)}, ${fixedNumber(g * 255)}, ${fixedNumber(b * 255)}, ${fixedNumber(a)})`

  const data = {
    display: 'flex',
    width: '100%',
    'max-width': absoluteBoundingBox.width + 'px',
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
  const children = reverseChildrens.map((node, index, array) => {
    const prevSibling = array[index - 1] || null;
    const traversedNode = traverseNode(node);

    if (prevSibling) {
      const nodeBoundingBox = node.absoluteBoundingBox;
      const prevSiblingBoundingBox = prevSibling.absoluteBoundingBox;

      const margin = nodeBoundingBox.y - (prevSiblingBoundingBox.y + prevSiblingBoundingBox.height);

      traversedNode.style['margin-top'] = margin + 'px';
    }

    return traversedNode;
  });

  // Add the child styles to the root
  styles.push(...children.filter(child => child.style).map(({ name, style, dependency = false }) => ({ name, style, dependency })));

  // Process the content
  if (children.length === 1 && !hasStyle)
    content = children[0].content;
  else
    content = `(${ dom(hasStyle ? name : 'div', children) })`;

  const data = { name, styles, content, children };

  addToCache(node.id, data);

  return data;
}
