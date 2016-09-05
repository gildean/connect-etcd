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
        store.set('123', { cookie: { maxAge: 100000 }, name: 'olli' }, function (err) {
            assert.ok(!err, '#set() got an error');
            //setTimeout(function () {
                //store.get('123', function(err, data) {
                    //assert.ok(!err, '#get() got an error');
                    //store.touch('123', { cookie: { maxAge: 100000 }, name: 'olli' }, function (err) {
                      //  assert.ok(!err, '#touch() got an error');
                        //store.get('123', function(err, data) {
                          //  assert.ok(!err, '#get() got an error');
                            store.destroy('123', function (err) {
                                assert.ok(!err, '#destroy() got an error');
                                 console.log('all tests passed');
                                 process.exit(0);
                            });
                        //});
                    //});
                //});
            //}, 10000);
        });
    });
});
