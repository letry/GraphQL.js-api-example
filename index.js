const Koa = require('koa');
const logger = require('koa-morgan');
const routes = require('./routes');

new Koa()
  .use(logger('tiny'))
  .use(routes)
  .listen(3000);