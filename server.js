const Koa = require('koa');
const Redis = require('ioredis');
const next = require('next');
const Router = require('koa-router');
const session = require('koa-session');
const koaBody = require('koa-body');
const atob = require('atob');

const config = require('./config');
const auth = require('./server/auth');
const api = require('./server/api');

const RedisSessionStore = require('./server/session-store');
const redis = new Redis(config.redis);

//初始化next render
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

//set gloabl atob for decode the base64 in server side
global.atob = atob;

app.prepare().then(() => {
  const server = new Koa();

  server.keys = ['cookie decrypt keys'];
  const SESSION_CONFIG = {
    key: 'sessionid',
    maxAge: 24 * 60 * 60 * 1000,
    store: new RedisSessionStore(redis),
  };

  server.use(koaBody());
  server.use(session(SESSION_CONFIG, server));

  //截获跟OAuth有关的请求
  auth(server);
  //截获和Github request有关的请求
  api(server);

  server.use(async (ctx, next) => {
    ctx.req.session = ctx.session;
    //将session传给nextjs上下文
    await handle(ctx.req, ctx.res);
    ctx.respond = false;
  });

  server.listen(3000, () => {
    console.log('server is running on port 3000');
  });
}); //编译完成后
