var assert = require('assert');
var session = require('express-session');
var EtcdStore = require('./');

var store = new EtcdStore();

store.set('123', { cookie: { maxAge: 100000 }, name: 'olli' }, function (err, ok) {
    assert.ok(!err, '#set() got an error');
    assert.ok(ok, '#set() is not ok');
    store.get('123', function(err, data) {
        assert.ok(!err, '#get() got an error');
        assert.deepEqual({ cookie: { maxAge: 100000 }, name: 'olli' }, data);
        store.set('123', { cookie: { maxAge: 100000 }, name: 'olli' }, function () {
            store.destroy('123', function () {
                 console.log('done');
                 process.exit(0);
            });
        });
    });
});
