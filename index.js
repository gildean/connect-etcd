var Etcd = require('node-etcd');
var util = require('util');
var validJson = require('validjson');
var session = require('express-session');
var defaultHost = '127.0.0.1';
var defaultPort = '2379';
var oneDay = 86400;

var Store = session.Store;

function EtcdStore(options) {
    options = options || {};
    Store.call(this, options);
    var url = options.url ? options.url : defaultHost + ':' + defaultPort;
    var etcdOpts = options.etcdOptions || {};
    this.client = new Etcd(url, etcdOpts);
    this.ttl = options.ttl;
    this.directory = (options.directory || 'express-session') + '/';
}
util.inherits(EtcdStore, Store);

EtcdStore.prototype.get = function get(sid, callback) {
    var key = this._getKeyFromId(sid);
    this.client.get(key, function (err, data) {
        if (err && err.errorCode !== 100) return callback(err);
        if (!data || err && err.errorCode === 100) return callback(null, null);
        var response = validJson(data.node.value);
        return callback(null, (response || null));
    });
};

EtcdStore.prototype.set = function set(sid, session, callback) {
    var key = this._getKeyFromId(sid);
    var ttl = this.ttl || ('number' == typeof session.cookie.maxAge ? session.cookie.maxAge / 1000 | 0 : oneDay);
    var value = JSON.stringify(session);
    return this.client.set(key, value, { ttl: ttl }, callback);
};
EtcdStore.prototype.touch = EtcdStore.prototype.set;

EtcdStore.prototype.all = function all(callback) {
    var key = this.directory;
    this.client.get(key, {recursive: true}, function (err, listing) {
        if (err) return callback(err);
        if (!listing || !listing.node || !listing.node.nodes || !listing.node.nodes.length) return callback(null, []);
        var sessions = listing.node.nodes.reduce(function (list, node) {
            var val = validJson(node.value);
            if (val) list.push(val);
            return list;
        }, []);
        return callback(null, sessions);
    });
};

EtcdStore.prototype.length = function length(callback) {
    this.all(function (err, sessions) {
        if (err) return callback(err);
        return callback(null, sessions.length);
    });
};

EtcdStore.prototype.clear = function clear(callback) {
    var key = this.directory;
    return this.client.del(key, { recursive: true }, callback);
};

EtcdStore.prototype.destroy = function destroy(sid, callback) {
    var key = this._getKeyFromId(sid);
    return this.client.del(key, callback);
};

EtcdStore.prototype._getKeyFromId = function _getKeyFromId(id) {
    return this.directory + id;
};

module.exports = EtcdStore;
