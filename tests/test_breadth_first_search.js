const mocha = require('mocha');
const chai = require('chai');
const breadthFirstSearch = require('../src/breadth_first_search.js');

const should = chai.should();


describe("breadth first search", function() {

  it("should work with single node graph", function() {
    const graphSearch = breadthFirstSearch(10, x => x, x => []);
    graphSearch.next().value.should.equal(10);
    graphSearch.next().done.should.be.true;
  });

  it("should work with simple uni-directed tree", function() {
    const node7 = { val: 7, adj: [] };
    const node6 = { val: 6, adj: [] };
    const node5 = { val: 5, adj: [] };
    const node4 = { val: 4, adj: [] };
    const node3 = { val: 3, adj: [node6, node7] };
    const node2 = { val: 2, adj: [node4, node5] };
    const node1 = { val: 1, adj: [node2, node3] };

    const graphSearch = breadthFirstSearch(
      node1, x => x.val, x => x.adj);

    graphSearch.next().value.should.equal(node1);
    graphSearch.next().value.should.equal(node2);
    graphSearch.next().value.should.equal(node3);
    graphSearch.next().value.should.equal(node4);
    graphSearch.next().value.should.equal(node5);
    graphSearch.next().value.should.equal(node6);
    graphSearch.next().value.should.equal(node7);
    graphSearch.next().done.should.be.true;
  });

  it("should work with simple bi-directed tree", function() {
    const node1 = { val: 1 };
    const node2 = { val: 2 };
    const node3 = { val: 3 };
    const node4 = { val: 4 };
    const node5 = { val: 5 };
    const node6 = { val: 6 };
    const node7 = { val: 7 };

    node1.adj = [node2, node3];
    node2.adj = [node1, node4, node5];
    node3.adj = [node1, node6, node7];
    node4.adj = [node2];
    node5.adj = [node2];
    node6.adj = [node3];
    node7.adj = [node3];

    const graphSearch = breadthFirstSearch(
      node1, x => x.val, x => x.adj);
    graphSearch.next().value.should.equal(node1);
    graphSearch.next().value.should.equal(node2);
    graphSearch.next().value.should.equal(node3);
    graphSearch.next().value.should.equal(node4);
    graphSearch.next().value.should.equal(node5);
    graphSearch.next().value.should.equal(node6);
    graphSearch.next().value.should.equal(node7);
    graphSearch.next().done.should.be.true;
  });

  it("should work with messy graph", function() {
    const node1 = { val: 1 };
    const node2 = { val: 2 };
    const node3 = { val: 3 };
    const node4 = { val: 4 };
    const node5 = { val: 5 };
    const node6 = { val: 6 };
    const node7 = { val: 7 };
    const node8 = { val: 8 };

    node1.adj = [node2, node7];
    node2.adj = [node2, node4];
    node3.adj = [node1, node6, node2];
    node4.adj = [node1];
    node5.adj = [node2, node8];
    node6.adj = [node7, node3];
    node7.adj = [node3, node5];
    node8.adj = [node8];

    const graphSearch = breadthFirstSearch(
      node1, x => x.val, x => x.adj);
    graphSearch.next().value.should.equal(node1);
    graphSearch.next().value.should.equal(node2);
    graphSearch.next().value.should.equal(node7);
    graphSearch.next().value.should.equal(node4);
    graphSearch.next().value.should.equal(node3);
    graphSearch.next().value.should.equal(node5);
    graphSearch.next().value.should.equal(node6);
    graphSearch.next().value.should.equal(node8);
    graphSearch.next().done.should.be.true;
  });

  it("should work with a generator function for getAdjacent", function() {
    const node4 = { val: 4, adj: [] };
    const node3 = { val: 3, adj: [node4] };
    const node2 = { val: 2, adj: [node3] };
    const node1 = { val: 1, adj: [node2, node3] };

    const getAdjacent = function* (node) {
      for (let adj of node.adj) {
        yield adj;
      }
    }

    const graphSearch = breadthFirstSearch(
      node1, n => n.val, n => getAdjacent(n));

    graphSearch.next().value.should.equal(node1);
    graphSearch.next().value.should.equal(node2);
    graphSearch.next().value.should.equal(node3);
    graphSearch.next().value.should.equal(node4);
    graphSearch.next().done.should.be.true;
  });

});
