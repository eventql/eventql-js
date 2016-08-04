'use strict'

const http = require("http");
const EventSource = require("eventsource");

//const log = debug('eventql:api'

class Request {
  constructor(auth) {
    this.auth = auth;
  }

  post(server_options, path, body, callback) {
    const json = JSON.stringify(body);
    const headers = Object.assign(this.__getAuthHeaders(), {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'X-EventQL-Namespace': server_options.database,
      'Content-Length': Buffer.byteLength(json)
    });

    var req = http.request({
      host: server_options.host,
      port: server_options.port,
      path: path,
      method: "POST",
      headers: headers
    }, function(res) {
      var status_code = res.statusCode;
      if (status_code == 201) {
        callback();
        return;
      }

      var body = ""
      res.setEncoding("utf8");
      res.on("data", function(chunk) {
        body += chunk;
      });

      res.on("end", function() {
        callback({code: status_code, message: body});
      });
    });

    req.on("error", function(e) {
      callback({messgae: e});
    });

    req.write(json);
    req.end();
  }

  sse_stream(server_options, path, callback_options) {
    const url = `http://${server_options.host}:${server_options.port}${path}`;
    let finished = false;
    const source = new EventSource(url, { headers: this.__getAuthHeaders() });
    source.addEventListener("progress", function(e) {
      if (callback_options.onProgress) {
        callback_options.onProgress(e.data);
      }
    });

    source.addEventListener("result", function(e) {
      if (!finished) {
        if (callback_options.onResult) {
          callback_options.onResult(e.data);
        }
        finished = true;
      }
    });

    source.addEventListener("query_error", function(e) {
      if (!finished) {
        if (callback_options.onError) {
          callback_options.onError("query_error", e.data);
        }
        finished = true;
      }
    });

    source.addEventListener("error", function(e) {
      if (!finished) {
        if (callback_options.onError) {
          callback_options.onError("error", e.data);
        }
        finished = true;
      }
    });
  }

  /******************* private ********************/
  __getAuthHeaders() {
    var auth_headers = {};
    if (typeof this.auth === "object") {
      if (this.auth.getAuthToken() != null) {
        auth_headers["Authorization"] = StringUtil.format(
            "Token $0",
            encodeURIComponent(this.auth.getAuthToken()));

      } else if (this.auth.getUser() != null && this.auth.getPassword() != null) {
        auth_headers["Authorization"] = StringUtil.format(
            "Basic $0",
            new Buffer(this.auth.getUser() + ":" + this.auth.getPassword()).toString("base64"));

      }
    }

    return auth_headers;
  }
}

//const request = async (uri, body, method = 'GET', database = '') => {
//    onsole.log(type());
//  const bodyString = JSON.stringify(body)
//
//  log('request:', uri, bodyString)
//
//  const headers = {
//    'Content-Type': 'application/json',
//    'Accept': 'application/json',
//    'X-EventQL-Namespace': database
//  }
//
//  const req = Object.assign({}, {
//    body: bodyString,
//    method,
//    headers
//  })
//
//  const response = await fetch(uri, req)
//  log('response status:', response.status, response.statusText)
//
//  const result = await response.text()
//  log('response body', result)
//}
//
//export { request, verbs }

module.exports = Request
