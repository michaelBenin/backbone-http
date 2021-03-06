
/*
  backbone-http.js 0.5.5
  Copyright (c) 2013 Vidigami - https://github.com/vidigami/backbone-http
  License: MIT (http://www.opensource.org/licenses/mit-license.php)
  Dependencies: Backbone.js, Underscore.js, Moment.js, Inflection.js, BackboneORM, and Superagent.
 */
var Cursor, HTTPCursor, JSONUtils, Utils, _,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

_ = require('underscore');

Cursor = require('backbone-orm').Cursor;

JSONUtils = require('backbone-orm').JSONUtils;

Utils = require('backbone-orm').Utils;

module.exports = HTTPCursor = (function(_super) {
  __extends(HTTPCursor, _super);

  function HTTPCursor() {
    return HTTPCursor.__super__.constructor.apply(this, arguments);
  }

  HTTPCursor.prototype.toJSON = function(callback) {
    var query, req;
    if (this.hasCursorQuery('$zero')) {
      return callback(null, this.hasCursorQuery('$one') ? null : []);
    }
    req = this.request.get(this.url).query(query = JSONUtils.toQuery(_.extend(_.clone(this._find), this._cursor))).type('json');
    this.sync.beforeSend(req, null);
    return req.end((function(_this) {
      return function(err, res) {
        var result;
        if (err) {
          return callback(err);
        }
        if (query.$one && (res.status === 404)) {
          return callback(null, null);
        }
        if (!res.ok) {
          return callback(new Error("Ajax failed with status " + res.status + " with: " + (Utils.inspect(res.body))));
        }
        result = JSONUtils.parse(res.body);
        return callback(null, _this.hasCursorQuery('$count') || _this.hasCursorQuery('$exists') ? result.result : result);
      };
    })(this));
  };

  return HTTPCursor;

})(Cursor);
