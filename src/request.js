const http = require("http");

//const log = debug('eventql:api')

class Request {
  constructor(auth) {
    this.auth = auth;
  }

  get() {

  }

  post(host, port, path, body, callback) {
    const json = JSON.stringify(body);
    const headers = Object.assign(this.__getAuthHeaders(this.auth), {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'X-EventQL-Namespace': body.database,
      'Content-Length': Buffer.byteLength(json)
    });

    var req = http.request({
      host: host,
      port: port,
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
