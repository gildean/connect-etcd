var assert = require('assert');
var session = require('express-session');
var EtcdStore = require('./');
var store = new EtcdStore({url: '192.168.99.100:32771', etcdOptions: { timeout: 1000 }});
var insert = { cookie: { maxAge: 100000 }, name: 'olli' };
var insertKey = '123';

setAndCheck(insertKey, insert, function (err, data) {
    assert.deepEqual(data, insert);
    setAndCheckAll(insertKey, data, function (err, reData) {
        assert.deepEqual(reData, insert);
        touchAndCheck(insertKey, insert, function (err) {
            remove(insertKey, function (err) {
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
        assert.ifError(err)
        if (expected !== undefined) assert.deepEqual(expected, data);
        return callback(err, data);
    });
}

function setAndCheck(key, data, callback) {
    store.set(key, data, function (err, ok) {
        assert.ifError(err)
        assert.ok(ok, '#set() is not ok');
        return get(key, data, callback);
    });
}

function setAndCheckAll(key, data, callback) {
    setAndCheck(key, data, function (err) {
        store.all(function (err, listing) {
            assert.ifError(err)
            var foundIndex = -1;
            var ok = listing.some(function (item, i) {
                var found = Object.keys(data).every(function (key) {
                    return JSON.stringify(data[key]) === JSON.stringify(item[key]);
                });
                if (found) foundIndex = i;
                return found;
            });
            assert.ok(ok, '#all() failed to deliver expected values');
            return callback(err, listing[foundIndex]);
        });
    });
}

function touchAndCheck(key, data, callback) {
    store.touch(key, data, function (err) {
        assert.ifError(err)
        setTimeout(get, 10000, key, data, callback);
    });
}

function remove(key, callback) {
    store.destroy(key, function (err) {
        assert.ifError(err)
        get(key, function (err, data) {
            assert.ifError(err)
            assert.ok(!data, '#destroy() failed!');
            return callback();
        });
    });
}
