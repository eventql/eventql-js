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

    this.api_path = "/api/v1";
    this.server_options = {
      database: opts.database,
      host: opts.host,
      port: opts.port,
    }
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
          this.server_options,
          `${this.api_path}/tables/create_table`,
          body,
          callback);
    } catch (err) {
      throw err
    }
  }

  insert(table, data, callback) {
    try {
      const body = Object.assign([], [{
        database: this.server_options.database,
        data,
        table
      }]);

      const req = new Request();
      req.post(
          this.server_options,
          `${this.api_path}/tables/insert`,
          body,
          callback);

    } catch (err) {
      throw err
    }
  }
}

module.exports = EventQL
