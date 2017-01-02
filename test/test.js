const assert = require('assert');
const index = require('../index.js');
const expect = require('chai').expect;

const Array = index.Array;
const numberize = index.numberize;
const elevatorProblem = index.elevatorProblem;

describe('Array', function() {
  describe('#max()', function() {
    it('should return the maximum value within the array', function() {
      assert.equal(3, [1,2,3].max());
    });
  });
  describe('#min()', function() {
    it('should return the minimum value within the array', function() {
      assert.equal(-1, [-1,2,3].min());
    });
  });
});

describe('Helper functions', function() {
  describe('#numberize()', function() {
    it('should return an array of numbers', function() {
      expect(numberize(['1', '2', '3000'])).to.satisfy(isArrayOfNumbers);

      function isArrayOfNumbers(array){
          return array.every(function(element){
              return typeof element === 'number';
          })
      }
    });
  });
});

describe('Elevator function', function() {
  describe('#elevatorProblem()', function() {
    it('should return a string', function() {
      expect(elevatorProblem('eztest1.txt')).to.be.a('string');
    });
    it('should end at a time where a passenger is exiting an elevator', function() {
      let log = elevatorProblem('eztest1.txt').split('\n');
      expect(log[log.length-1]).to.contain('exits');
    });
  });
});