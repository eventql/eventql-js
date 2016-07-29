import fetch from 'isomorphic-fetch'
import debug from 'debug'

const log = debug('eventql:api')

const verbs = {
  post: 'POST',
  get: 'GET',
  put: 'PUT'
}

const request = async (uri, body, method = 'GET', database = '') => {
  const bodyString = JSON.stringify(body)

  log('request:', uri, bodyString)

  const headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'X-EventQL-Namespace': database
  }

  const req = Object.assign({}, {
    body: bodyString,
    method,
    headers
  })

  const response = await fetch(uri, req)
  log('response status:', response.status, response.statusText)

  const result = await response.text()
  log('response body', result)
}

export { request, verbs }
