const Router = require('koa-router');
const router = new Router();
const bodyParser = require('koa-body');
const schema = require('../models');
const { graphqlKoa } = require('apollo-server-koa');

router.all('/graphql', bodyParser(), graphqlKoa({ schema }))

router.get('/', async ctx => {
  const products = await product.find()
    .populate('ingredients').lean();
  ctx.body = products;
});

router.post('/products', bodyParser(), ctx => {
  ctx.body = ctx.request.body;
});

router.put('/product', bodyParser(), async ctx => {
  const result = await product.create(ctx.request.body);
  ctx.body = result.toJSON();
  console.log(1);
});

router.get('/ingredient', async ctx => {
  ctx.body = await ingredient.find().lean();
});

router.put('/ingredient', bodyParser(), async ctx => {
  const result = await ingredient.create(ctx.request.body);
  ctx.body = result.toJSON();
});

module.exports = router.routes();