'use strict'

const Request = require('./Request');

class EventQL {
  constructor (opts) {
    if (!opts.database) {
      throw new Error('Please supply database name as `database`')
    }
    if (!opts.host) {
      throw new Error('Please supply database host as `host`')
    }
    if (!opts.port) {
      throw new Error('Please supply database port as `port`')
    }

    this.database = opts.database;
    this.host = opts.host;
    this.port = opts.port;
    this.api_path = "/api/v1";
    this.uri = `http://${opts.host}:${opts.port}/api/v1`
  }

  createTable(table, columns, callback) {
    try {
      const body = Object.assign({}, {
        database: this.database,
        table_name: table,
        table_type: 'timeseries', //FIXME
        schema: {
          columns
        }
      })

      const req = new Request();
      req.post(
          this.host,
          this.port,
          `${this.api_path}/tables/create_table`,
          body,
          callback);
    //  await request(
    //    `${this.uri}/tables/create_table`,
    //    body,
    //    verbs.post,
    //    this.database
    // )
    } catch (err) {
      throw err
    }
  }

  insert(table, data) {
    //try {
    //  const body = Object.assign([], [{
    //    database: this.database,
    //    data,
    //    table
    //  }])

    //  await request(
    //    `${this.uri}/tables/insert`,
    //    body,
    //    verbs.post
    //  )
    //} catch (err) {
    //  throw err
    //}
  }
}

module.exports = EventQL
