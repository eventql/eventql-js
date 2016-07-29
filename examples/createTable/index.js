import { EventQL } from '../../src'

const db = new EventQL({
  host: 'localhost',
  port: 9175,
  database: 'example'
})

const go = async () => {
  await db.createTable('sensors', [
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
  ])
}

go()

