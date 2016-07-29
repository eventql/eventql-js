import { EventQL } from '../../src'

const db = new EventQL({
  host: 'localhost',
  port: 9175,
  database: 'example'
})

const go = async () => {
  for (let i = 0; i < 100; i++) {
    const now = new Date()
    const time = now.toISOString()

    await db.insert('sensors', {
      name: `name-${i}`,
      value: `value-${i}`,
      time
    })
  }
}

go()

