'use strict';

let path = require('path');

let koa = require('koa');

let port = 9777;

let router = require('../index.js')();
	router.load(path.join(__dirname, 'resources'));

let app = koa();
	app.use(router.routes());
	app.listen(port);

console.log(`Server started: http://localhost:${port}`);