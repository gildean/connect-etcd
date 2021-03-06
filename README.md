express-etcd
============

[![NPM](https://nodei.co/npm/express-etcd.png)](https://nodei.co/npm/express-etcd)

express-etcd is a Etcd session store for express backed by [node-etcd](https://github.com/stianeikeland/node-etcd)

Installation
------------

`npm install express-etcd --save`


Options
-------

  - `url` Etcd host url or urls (either a string or an array)
  - `directory` Etcd directory to use (default `express-session`)
  - `ttl` time-to-live (expiration) in seconds that the key will last for. By default the maxAge of the session cookie will be used.
  - `etcdOptions` Object passed through to the [node-etcd constructor](https://github.com/stianeikeland/node-etcd#constructor-options)


Usage
-----

```js
var session = require('express-session');
var EtcdStore = require('express-etcd');
var options = {
    url: ['foo.bar:2379', 'baz.bar:2379'],
    directory: 'mydir',
    etcdOptions: {
        timeout: 1000
    }
};

app.use(session({
    store: new EtcdStore(options),
    secret: 'banaanivarkaita',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true }
}));
```


License
-------

http://ok.mit-license.org
