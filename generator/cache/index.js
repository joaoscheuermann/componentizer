const cache = {};

module.exports = {
  registers () {
    return cache;
  },

  add (id, value) {
    cache[id] = value;
    return
  },

  retrieve (id) {
    return cache[id]
  },

  async remove (id) {
    if (!cache[id]) return

    cache[id] = null;
    delete cache[id];

    return
  },
}
