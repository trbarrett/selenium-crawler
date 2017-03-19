

/**
 * Simple Queue data structure implemented with a doubley linked list
 */
function Queue() {
  function Node(val, next, prev) {
    this.val = val;
    this.next = next;
    this.prev = prev;
    return this;
  };
  let head = null;
  let tail = null;
  let length = 0;

  return {
    enqueue: function(val) {
      var newHead = new Node(val, head, null);
      if (head) {
        newHead.next = head;
        head.prev = newHead;
      }
      head = newHead;
      if (!tail) { tail = head; }
      length++;
    },
    dequeue: function() {
      if (!tail) { return null; }
      const val = tail.val;
      if (tail.prev) {
        tail = tail.prev;
      } else {
        tail = null;
        head = null;
      }
      length--;
      return val;
    },
    peek: function() {
      if (!tail) { return null; }
      return tail.val;
    },
    length: function() {
      return length;
    }
  };
}

module.exports = Queue;
