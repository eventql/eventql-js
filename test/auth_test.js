'use strict'

var assert = require('assert');
var Auth = require('../src/auth');

describe('Auth', function() {
  describe("get", function() {
    it("it should return null if no value was set", function() {
      var auth = new Auth();
      assert.equal(auth.getDatabase(), null);
      assert.equal(auth.getAuthToken(), null);
    });
  });

  describe("{set,get}", function() {
    it("it should return a value if set was called", function() {
      var auth = new Auth();
      auth.setDatabase("my_db");
      assert.equal(auth.getDatabase(), "my_db");
      assert.equal(auth.getAuthToken(), null);
    });
  });
});

