const Queue = require('./queue.js');

/**
 * Breadth first search function
 * Implemented as a generator, so callers can step through as required
 * NOTE: first call will return the startNode
 * @param {any} startNode - where to start the search from
 * @param {function} getKey - function that can get a 'key' for any given node.
 *   The key is used to ensure we don't revisit a node
 * @param {function} getAdjacent - function that finds all the adjacent
 *   'connected' nodes for the given node
 */
function* breadthFirstSearch(startNode, getKey, getAdjacent) {
  const visited = new Set();
  visited.add(getKey(startNode));
  const queue = new Queue();
  queue.enqueue(startNode);
  while (queue.length()) {
    const curr = queue.dequeue();
    yield curr;
    const adj = getAdjacent(curr);
    for (let v of adj) {
      const key = getKey(v);
      if (!visited.has(key)) {
        visited.add(key);
        queue.enqueue(v);
      }
    }
  }
}

module.exports = breadthFirstSearch;
