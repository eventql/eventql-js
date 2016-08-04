'use strict'

class Auth {
  constructor() {
    this.database = null;
    this.auth_token = null;
    this.user = null;
    this.password = null;
  }

  setDatabase(database) {
    this.database = database;
  }

  setAuthToken(auth_token) {
    this.auth_token = auth_token;
  }

  setUser(user) {
    this.user = user;
  }

  setPassword(password) {
    this.password = password;
  }

  /**
    * Returns the name of the database if set or null otherwise
    */
  getDatabase() {
    return this.database;
  }

  /**
    * Returns the auth token if set or null otherwise
    */
  getAuthToken() {
    return this.auth_token;
  }


  /**
    * Returns the user's name if set or null otherwise
    */
  getUser() {
    return this.user;
  }

  /**
    * Returns the user's password if set or null otherwise
    */
  getPassword() {
    return this.password;
  }

}

module.exports = Auth;

