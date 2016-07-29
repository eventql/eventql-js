import { verbs, request } from './request'

export default class EventQL {
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

    this.database = opts.database
    this.uri = `http://${opts.host}:${opts.port}/api/v1`
  }

  createTable = async (table, columns, type = 'timeseries') => {
    try {
      const body = Object.assign({}, {
        database: this.database,
        table_name: table,
        table_type: type,
        schema: {
          columns
        }
      })

      await request(
        `${this.uri}/tables/create_table`,
        body,
        verbs.post,
        this.database
     )
    } catch (err) {
      throw err
    }
  }

  insert = async (table, data) => {
    try {
      const body = Object.assign([], [{
        database: this.database,
        data,
        table
      }])

      await request(
        `${this.uri}/tables/insert`,
        body,
        verbs.post
      )
    } catch (err) {
      throw err
    }
  }
}
