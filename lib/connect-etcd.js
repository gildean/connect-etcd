/*!
* Connect - etcd
* Copyright(c) 2014 Opentable <rtomlinson@opentable.com>
* MIT Licensed
*/

var Etcd = require('node-etcd');

var defaultHost = '127.0.0.1';
var defaultPort = '4001';
var oneDay = 86400;

module.exports = function (session) {
    var Store = session.Store;

    function EtcdStore(options) {
        options = options || {};
        Store.call(this, options);
        var url = options.url ? options.url : defaultHost + ':' + defaultPort;
        this.client = new Etcd(url);
        this.ttl = options.ttl;
        this.directory = options.directory || 'session';
    }

    EtcdStore.prototype.__proto__ = Store.prototype;

    EtcdStore.prototype.get = function (sid, callback) {
        sid = this.directory + '/' + sid;
        this.client.get(sid, function (err, data) {
            if (err) return callback(err.errorCode !== 100 ? err : undefined);
            if (!data) return callback(null);
            try {
                return callback(null, JSON.parse(data.node.value));
            } catch (err) {
                return callback(err);
            }
        });
    };

    EtcdStore.prototype.set = function (sid, sess, callback) {
        sid = this.directory + '/' + sid;
        var maxAge = sess.cookie.maxAge;
        var ttl = this.ttl;
        ttl = ttl || ('number' == typeof maxAge ? maxAge / 1000 | 0 : oneDay);
        this.client.set(sid, JSON.stringify(sess), { ttl: ttl }, function (err) {
            callback && callback.apply(this, arguments);
        });
    };

    EtcdStore.prototype.destroy = function (sid, callback) {
        sid = this.directory + '/' + sid;
        this.client.del(sid, callback);
    };
    return EtcdStore;
};
