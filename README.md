# Connect Etcd
============

[![Build Status](https://travis-ci.org/opentable/connect-etcd.svg?branch=master)](https://travis-ci.org/opentable/connect-etcd)

[![NPM](https://nodei.co/npm/connect-etcd.png)](https://nodei.co/npm/connect-etcd)

connect-etcd is a Etcd session store for express backed by [node-etcd](https://github.com/stianeikeland/node-etcd)

## Installation

		$ npm install connect-etcd

## Options

	- `url` Etcd host url
	- `port` Etcd port
	- `ttl` time-to-live (expiration) in seconds that the key will last for. By default the maxAge of the session cookie will be used.

## Usage

	var session = require('express-session');
	var EtcdStore = require('connect-etcd')(session);

	app.use(session({
		store: new EtcdStore(options),
		secret: 'hobknob'
	}));

# License

	MIT
