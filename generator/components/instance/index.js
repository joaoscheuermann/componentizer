const { retrieve: retrieveFromCache } = require('../../cache');

module.exports = (node) => {
  const { name, children } = retrieveFromCache(node.componentId);

  let content = '';

  // Handle the text
  if (children.length === 1 && children[0].text)
    content = `<${ name }>${ node.children[0].characters }</${ name }>`;
  else
    content = `<${ name }/>`;

  return { name, dependency: true, style: {}, content };
}
