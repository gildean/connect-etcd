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
    this.client = new Etcd(url);
    this.ttl = options.ttl;
    this.directory = options.directory || 'express-session';
}
util.inherits(EtcdStore, Store);

EtcdStore.prototype.get = function (sid, callback) {
    sid = this.directory + '/' + sid;
    this.client.get(sid, function (err, data) {
        if (err && err.errorCode !== 100) return callback(err);
        if (!data || err && err.errorCode === 100) return callback(null, null);
        var response = validJson(data.node.value);
        return callback(null, (response || null));
    });
};

EtcdStore.prototype.set = function (sid, session, callback) {
    sid = this.directory + '/' + sid;
    var ttl = this.ttl || ('number' == typeof session.cookie.maxAge ? session.cookie.maxAge / 1000 | 0 : oneDay);
    return this.client.set(sid, JSON.stringify(session), { ttl: ttl }, callback);
};

EtcdStore.prototype.touch = EtcdStore.prototype.set;

EtcdStore.prototype.destroy = function (sid, callback) {
    sid = this.directory + '/' + sid;
    return this.client.del(sid, callback);
};

module.exports = EtcdStore;
