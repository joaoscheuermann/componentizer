
module.exports = {
  dom: (tag, content) => `<${ tag }>${ Array.isArray(content) ? content.reduce((prev, next) => prev + next.content , '') : content }</${tag}>`,
  camelCaseToDashCase: string => string.replace(/([A-Z])/g, (g) => `-${g[0].toLowerCase()}`),
  pascalCase: string => string.split(" ").map(string => string.charAt(0).toUpperCase() + string.slice(1)).join(''),
}
