var assert = require('assert');
var session = require('express-session');
var EtcdStore = require('./');
var store = new EtcdStore();
var insert = { cookie: { maxAge: 100000 }, name: 'olli' };
var insertKey = '123';

setAndCheck(insertKey, insert, function (err, data) {
    assert.ok(!err, '#setAndCheck() got an error');
    assert.deepEqual(data, insert);
    setAndCheck(insertKey, data, function (err, reData) {
        assert.ok(!err, '#setAndCheck() got an error');
        assert.deepEqual(reData, insert);
        touchAndCheck(insertKey, insert, function (err) {
            assert.ok(!err, '#touchAndCheck() got an error');
            remove(insertKey, function (err) {
                assert.ok(!err, '#remove() got an error');
                console.log('all tests passed');
                process.exit(0);
            });
        });
    });
});

function get(key, expected, callback) {
    if ('function' === typeof expected) {
        callback = expected;
        expected = undefined;
    }
    store.get(key, function (err, data) {
        assert.ok(!err, '#get() got an error');
        if (expected !== undefined) assert.deepEqual(expected, data);
        return callback(err, data);
    });
}

function setAndCheck(key, data, callback) {
    store.set(key, data, function (err, ok) {
        assert.ok(!err, '#set() got an error');
        assert.ok(ok, '#set() is not ok');
        return get(key, data, callback);
    });
}

function touchAndCheck(key, data, callback) {
    store.touch(key, data, function (err) {
        assert.ok(!err, '#touch() got an error');
        setTimeout(get, 10000, key, data, callback);
    });
}

function remove(key, callback) {
    store.destroy(key, function (err) {
        assert.ok(!err, '#destroy() got an error');
        get(key, function (err, data) {
            assert.ok(!err, '#get() got an error');
            assert.ok(!data, '#destroy() failed!');
            return callback();
        });
    });
}
