var expect = require('chai').expect
var EtcdStore = require('./');
// this requires an actual etcd server to test, so note that
var store = new EtcdStore({ dir: 'express-etcd-test', etcdOptions: { timeout: 1000 } });
var insert = { cookie: { maxAge: 100000 }, name: 'olli' };
var insertKey = '123';

describe('EtcdStore', function () {
    describe('#set()', function () {
        it('should save without error', function (done) {
            store.set(insertKey, insert, done);
        });
    });
    describe('#get()', function () {
        it('should return a session without an error', function (done) {
            store.get(insertKey, function (err, data) {
                expect(err).to.not.exist;
                expect(data).to.deep.equal(insert);
                return done();
            });
        });
    });
    describe('#all()', function () {
        this.slow(20000);
        it('should return a list of all the sessions', function (done) {
            store.all(function (err, listing) {
                expect(err).to.not.exist;
                expect(listing).to.exist;
                var foundIndex = -1;
                var ok = listing.some(function (item, i) {
                    var found = Object.keys(insert).every(function (key) {
                        return JSON.stringify(insert[key]) === JSON.stringify(item[key]);
                    });
                    if (found) foundIndex = i;
                    return found;
                });
                expect(ok).to.be.ok;
                done();
            });
        });
    });
    describe('#length()', function () {
        it('return a length without an error', function (done) {
            store.length(function (err, len) {
                expect(err).to.not.exist;
                expect(len).to.be.a('number');
                done();
            });
        });
    });
    describe('#destroy()', function () {
        it('should destroy sessiondata without error', function (done) {
            store.destroy(insertKey, done);
        });
    });
    describe('#clear()', function () {
        it('should clear all sessiondata without error', function (done) {
            store.clear(done);
        });
    });
});
