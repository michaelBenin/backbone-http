(function() {
  var globals = {};

/* local-only brunch-like require (based on https://github.com/brunch/commonjs-require-definition) */
(function() {
  'use strict';

  var modules = {};
  var cache = {};

  var has = function(object, name) {
    return ({}).hasOwnProperty.call(object, name);
  };

  var expand = function(root, name) {
    var results = [], parts, part;
    if (/^\.\.?(\/|$)/.test(name)) {
      parts = [root, name].join('/').split('/');
    } else {
      parts = name.split('/');
    }
    for (var i = 0, length = parts.length; i < length; i++) {
      part = parts[i];
      if (part === '..') {
        results.pop();
      } else if (part !== '.' && part !== '') {
        results.push(part);
      }
    }
    return results.join('/');
  };

  var dirname = function(path) {
    return path.split('/').slice(0, -1).join('/');
  };

  var localRequire = function(path) {
    var _require = function(name) {
      var dir = dirname(path);
      var absolute = expand(dir, name);
      return globals.require(absolute, path);
    };
    _require.register = globals.require.register;
    _require.shim = globals.require.shim;
    return _require;
  };

  var initModule = function(name, definition) {
    var module = {id: name, exports: {}};
    cache[name] = module;
    definition(module.exports, localRequire(name), module);
    return module.exports;
  };

  var require = function(name, loaderPath) {
    var path = expand(name, '.');
    if (loaderPath == null) loaderPath = '/';

    if (has(cache, path)) return cache[path].exports;
    if (has(modules, path)) return initModule(path, modules[path]);

    var dirIndex = expand(path, './index');
    if (has(cache, dirIndex)) return cache[dirIndex].exports;
    if (has(modules, dirIndex)) return initModule(dirIndex, modules[dirIndex]);

    throw new Error('Cannot find module "' + name + '" from '+ '"' + loaderPath + '"');
  };

  var define = function(bundle, fn) {
    if (typeof bundle === 'object') {
      for (var key in bundle) {
        if (has(bundle, key)) {
          modules[key] = bundle[key];
        }
      }
    } else {
      modules[bundle] = fn;
    }
  };

  var toString = Object.prototype.toString;
  var isArray = function(obj) { return toString.call(obj) === '[object Array]'; }

  // client shimming to add to local module system
  var shim = function(info) {
    if (typeof window === "undefined") return;
    if (!isArray(info)) info = [info];

    var iterator = function(item) {
      var dep;

      // already registered with local require
      try { if (globals.require(item.path)) { return; } } catch (e) {}

      // use global require
      try { dep = typeof window.require === "function" ? window.require(item.path) : void 0; } catch (e) {}

      // use symbol path on window
      if (!dep && item.symbol) {
        var components = item.symbol.split('.');
        dep = window;
        for (var i = 0, length = components.length; i < length; i++) { if (!(dep = dep[components[i]])) break; }
      }

      // not found
      if (!dep) {
        if (item.optional) return;
        throw new Error("Missing dependency: " + item.path);
      }

      // register with local require
      globals.require.register(item.path, (function(exports, require, module) { return module.exports = dep; }));
      if (item.alias) { globals.require.register(item.alias, (function(exports, require, module) { return module.exports = dep; })); }
    };

    for (var i = 0, length = info.length; i < length; i++) { iterator(info[i]); }
  };

  globals.require = require;
  globals.require.register = define;
  globals.require.shim = shim;
}).call(this);
var require = globals.require;
require.register('cursor', function(exports, require, module) {

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

});
require.register('index', function(exports, require, module) {

/*
  backbone-http.js 0.5.5
  Copyright (c) 2013 Vidigami - https://github.com/vidigami/backbone-http
  License: MIT (http://www.opensource.org/licenses/mit-license.php)
  Dependencies: Backbone.js, Underscore.js, Moment.js, Inflection.js, BackboneORM, and Superagent.
 */
var bborm, path, _i, _len, _ref;

if ((typeof window !== "undefined" && window !== null) && require.shim) {
  require.shim([
    {
      symbol: '_',
      path: 'lodash',
      alias: 'underscore',
      optional: true
    }, {
      symbol: '_',
      path: 'underscore'
    }, {
      symbol: 'Backbone',
      path: 'backbone'
    }, {
      symbol: 'moment',
      path: 'moment'
    }, {
      symbol: 'stream',
      path: 'stream',
      optional: true
    }, {
      symbol: 'BackboneORM',
      path: 'backbone-orm'
    }, {
      symbol: 'superagent',
      path: 'superagent'
    }
  ]);
}

module.exports = {
  sync: require('./sync'),
  modules: {
    'backbone-orm': bborm = require('backbone-orm'),
    'superagent': require('superagent')
  }
};

_ref = ['url', 'querystring', 'lru-cache', 'underscore', 'backbone', 'moment', 'inflection', 'stream'];
for (_i = 0, _len = _ref.length; _i < _len; _i++) {
  path = _ref[_i];
  module.exports.modules[path] = bborm.modules[path];
}

});
require.register('sync', function(exports, require, module) {

/*
  backbone-http.js 0.5.5
  Copyright (c) 2013 Vidigami - https://github.com/vidigami/backbone-http
  License: MIT (http://www.opensource.org/licenses/mit-license.php)
  Dependencies: Backbone.js, Underscore.js, Moment.js, Inflection.js, BackboneORM, and Superagent.
 */
var Backbone, HTTPCursor, HTTPSync, JSONUtils, ModelCache, Schema, Utils, bborm, _;

_ = require('underscore');

Backbone = require('backbone');

bborm = require('backbone-orm');

Schema = bborm.Schema;

Utils = bborm.Utils;

JSONUtils = bborm.JSONUtils;

ModelCache = bborm.CacheSingletons.ModelCache;

HTTPCursor = require('./cursor');

HTTPSync = (function() {
  function HTTPSync(model_type, options) {
    this.model_type = model_type;
    if (options == null) {
      options = {};
    }
    !options.beforeSend || (this._beforeSend = options.beforeSend);
    this.model_type.model_name = Utils.findOrGenerateModelName(this.model_type);
    if (!(this.url = _.result(new this.model_type, 'url'))) {
      throw new Error("Missing url for model: " + this.model_type);
    }
    this.schema = new Schema(this.model_type);
    this.request = require('superagent');
  }

  HTTPSync.prototype.initialize = function(model) {
    if (this.is_initialized) {
      return;
    }
    this.is_initialized = true;
    return this.schema.initialize();
  };

  HTTPSync.prototype.resetSchema = function(options, callback) {
    var req;
    req = this.request.del(this.url);
    this.beforeSend(req, null, options);
    return req.end(function(err, res) {
      if (err) {
        return callback(err);
      }
      if (!res.ok) {
        return callback(new Error("Ajax failed with status " + res.status + " for " + 'destroy' + " with: " + (Utils.inspect(res.body))));
      }
      return callback();
    });
  };

  HTTPSync.prototype.cursor = function(query) {
    if (query == null) {
      query = {};
    }
    return new HTTPCursor(query, {
      model_type: this.model_type,
      url: this.url,
      request: this.request,
      sync: this
    });
  };

  HTTPSync.prototype.destroy = function(query, callback) {
    var req;
    req = this.request.del(this.url).query(query);
    this.beforeSend(req, null);
    return req.end(function(err, res) {
      if (err) {
        return callback(err);
      }
      if (!res.ok) {
        return callback(new Error("Ajax failed with status " + res.status + " for " + 'destroy' + " with: " + (Utils.inspect(res.body))));
      }
      return callback();
    });
  };

  HTTPSync.prototype.beforeSend = function(req, model, options) {
    if (options == null) {
      options = {};
    }
    !options.beforeSend || options.beforeSend(req, model, options, this);
    return !this._beforeSend || this._beforeSend(req, model, options, this);
  };

  return HTTPSync;

})();

module.exports = function(type, sync_options) {
  var model_type, sync, sync_fn;
  if (Utils.isCollection(new type())) {
    model_type = Utils.configureCollectionModelType(type, module.exports, sync_options);
    return type.prototype.sync = model_type.prototype.sync;
  }
  sync = new HTTPSync(type, sync_options);
  type.prototype.sync = sync_fn = function(method, model, options) {
    var req, request, url;
    if (options == null) {
      options = {};
    }
    sync.initialize();
    if (method === 'createSync') {
      return module.exports.apply(null, Array.prototype.slice.call(arguments, 1));
    }
    if (method === 'sync') {
      return sync;
    }
    if (method === 'schema') {
      return sync.schema;
    }
    if (method === 'isRemote') {
      return true;
    }
    if (_.contains(['create', 'update', 'patch', 'delete', 'read'], method)) {
      if (!(url = options.url || _.result(model, 'url'))) {
        throw new Error('Missing url for model');
      }
      request = sync.request;
      switch (method) {
        case 'read':
          req = request.get(url).query({
            $one: !model.models
          }).type('json');
          break;
        case 'create':
          req = request.post(url).send(options.attrs || model.toJSON(options)).type('json');
          break;
        case 'update':
          req = request.put(url).send(options.attrs || model.toJSON(options)).type('json');
          break;
        case 'patch':
          req = request.patch(url).send(options.attrs || model.toJSON(options)).type('json');
          break;
        case 'delete':
          req = request.del(url);
      }
      sync.beforeSend(req, model, options);
      req.end(function(err, res) {
        if (err) {
          return options.error(err);
        }
        if (!res.ok) {
          return options.error(new Error("Ajax failed with status " + res.status + " for " + method + " with: " + (Utils.inspect(res.body))));
        }
        return options.success(JSONUtils.parse(res.body));
      });
      return;
    }
    if (sync[method]) {
      return sync[method].apply(sync, Array.prototype.slice.call(arguments, 1));
    } else {
      return void 0;
    }
  };
  Utils.configureModelType(type);
  return ModelCache.configureSync(type, sync_fn);
};

});

  if (typeof define == 'function' && define.amd) {
    define(["require","backbone-orm","superagent"], function(){ return require('index'); });
  }
  else if (typeof exports == 'object') {
    module.exports = require('index');
  } else {
    this['BackboneHTTP'] = require('index');
  }

}).call(this);