'use strict'

const http = require('http');
const Auth = require('./Auth');
const EventSource = require("eventsource");

class EventQL {
  constructor (host, port, auth) {
    if (typeof host !== 'string') {
      throw new Error('Please provide host as string')
    }

    if (typeof port !== 'number') {
      throw new Error('Please provide port as a number')
    }

    if (!(auth instanceof Auth)) {
      throw new Error('Please provide an instance of class Auth');
    }

    this.api_path = "/api/v1";
    this.host = host;
    this.port = port;
    this.auth = auth;
  }

  createTable(table, columns, callback) {
    try {
      const body = Object.assign({}, {
        database: this.auth.getDatabase(),
        table_name: table,
        table_type: 'timeseries', //FIXME
        schema: {
          columns
        }
      })

      this.__post('/tables/create_table', body, callback);
    } catch (err) {
      throw err
    }
  }

  insert(table, data, callback) {
    try {
      const body = Object.assign([], [{
        database: this.auth.getDatabase(),
        data,
        table
      }]);

      this.__post('/tables/insert', body, callback);
    } catch (err) {
      throw err
    }
  }

  execute(sql_query, cb_opts) {
    try {
      const query_str = `format=json_sse&database=${encodeURIComponent(this.auth.getDatabase())}&query=${encodeURIComponent(sql_query)}`
      this.__sse_stream(
          `/sql?${query_str}`,
          cb_opts);

    } catch (err) {
      throw err;
    }
  }

  /******************* private ***********************/

  __post(path, body, callback) {
    const json = JSON.stringify(body);
    const headers = Object.assign(this.__getAuthHeaders(), {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Content-Length': Buffer.byteLength(json)
    });

    var req = http.request({
      host: this.host,
      port: this.port,
      path: `${this.api_path}${path}`,
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
      callback({message: e});
    });

    req.write(json);
    req.end();
  }

  __sse_stream(path, callback_options) {
    const url = `http://${this.host}:${this.port}${this.api_path}${path}`;
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

  __getAuthHeaders() {
    let auth_headers = {};
    if (this.auth.getAuthToken() != null) {
      auth_headers["Authorization"] = StringUtil.format(
          "Token $0",
          encodeURIComponent(this.auth.getAuthToken()));

    } else if (this.auth.getUser() != null && this.auth.getPassword() != null) {
      auth_headers["Authorization"] = StringUtil.format(
          "Basic $0",
          new Buffer(this.auth.getUser() + ":" + this.auth.getPassword()).toString("base64"));

    } else {
      auth_headers['X-EventQL-Namespace'] = this.auth.getDatabase();
    }

    return auth_headers;
  }
}

module.exports = EventQL
