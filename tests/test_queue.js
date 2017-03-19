const mocha = require('mocha');
const chai = require('chai');
const Queue = require('../src/queue.js');

const should = chai.should();

describe("queue", function() {
  let queue;
  beforeEach(function() {
    queue = new Queue();
  });

  it("should enqueue to an empty queue", function() {
    queue.enqueue(10);
    queue.peek().should.equal(10);
  });

  it("should enqueue to an existing queue", function() {
    queue.enqueue(10);
    queue.enqueue(12);
    queue.peek().should.equal(10); //should still be the first item queued
  });

  it("should dequeue from a list with just one item", function() {
    queue.enqueue(10);
    queue.dequeue().should.equal(10);
  });

  it("should get null when dequeueing from an empty queue", function() {
    should.not.exist(queue.dequeue());
  });

  it("should enqueue then dequeue correctly", function() {
    queue.enqueue(10);
    queue.enqueue(12);
    queue.dequeue().should.equal(10);
    queue.dequeue().should.equal(12);
    should.not.exist(queue.dequeue());
  });

  it("should enqueue then dequeue mixed times", function() {
    queue.enqueue(10);
    queue.enqueue(12);
    queue.dequeue().should.equal(10);
    queue.enqueue(40);
    queue.enqueue(22);
    queue.dequeue().should.equal(12);
    queue.dequeue().should.equal(40);
    queue.enqueue("abcd");
    queue.dequeue().should.equal(22);
    queue.dequeue().should.equal("abcd");
    should.not.exist(queue.dequeue());
    queue.enqueue(["a", "b", "c"]);
    queue.enqueue(14.229);
    queue.dequeue().should.eql(["a", "b", "c"]);
    queue.enqueue(22);
    queue.dequeue().should.equal(14.229);
    queue.dequeue().should.equal(22);
  });

  it("should get correct length from an empty queue", function() {
    queue.length().should.equal(0);
  });

  it("should get correct length after enqueuing once", function() {
    queue.enqueue(10);
    queue.length().should.equal(1);
  });

  it("should get correct length after enqueuing twice", function() {
    queue.enqueue(10);
    queue.enqueue(12);
    queue.length().should.equal(2);
  });

  it("should get correct length after enqueuing and dequeuing once", function() {
    queue.enqueue(10);
    queue.dequeue();
    queue.length().should.equal(0);
  });

  it("should get correct length after enqueuing twice and dequeuing once", function() {
    queue.enqueue(10);
    queue.enqueue(12);
    queue.dequeue();
    queue.length().should.equal(1);
  });

});
