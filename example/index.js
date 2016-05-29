'use strict';

let koa = require('koa');

let port = 9777;

let router = require('../index.js')();
	router.load(`${__dirname}/resources`);

let app = koa();
	app.use(router.routes());
	app.listen(port);

console.log(`Server started at port: ${port}`);