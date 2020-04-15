module.exports = {
  COMPONENT: require('./component'),
  INSTANCE: require('./instance'),
  TEXT: require('./text'),

  default: node => {
    console.warn(`[WARN] ${node.type} is not supported`);
    return { name: 'nonode', content: '' }
  }
}
