'use strict'

var assert = require("assert");
var EventQL = require('../src/eventql');

const opts = {
  database: 'test',
  port: 9175,
  host: 'localhost'
}

describe('EventQL', function() {
  describe('constructor', function() {
    it("it should throw an exception if host or port aren;'t provided", function() {
      assert.throws(function() {
        new EventQL({});
      }, Error);
    });
  });

  describe('createTable', function() {
    it("should create a new table", function(done) {
      let eventql = new EventQL(opts);
      eventql.createTable('sensors1', [
        {
          id: 1,
          name: 'time',
          type: 'DATETIME',
          optional: false,
          repeated: false
        },
        {
          id: 2,
          name: 'name',
          type: 'STRING',
          optional: false,
          repeated: false
        },
        {
          id: 3,
          name: 'value',
          type: 'STRING',
          optional: false,
          repeated: false
        }
      ], (error) => {
        if (error !== undefined) {
          assert.equal('error: table already exists', error.message);
        }
        done();
      })
    });
  });
});
