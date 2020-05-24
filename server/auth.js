const axios = require('axios');
const config = require('../config');
const { client_id, client_secret, request_token_url } = config.github;

module.exports = (server) => {
  server.use(async (ctx, next) => {
    if (ctx.path === '/auth') {
      const code = ctx.query.code;
      if (!code) {
        ctx.body = 'code not exist';
        return;
      }

      const result = await axios({
        methods: 'POST',
        url: request_token_url,
        data: {
          client_id,
          client_secret,
          code,
        },
        headers: {
          Accept: 'application/json',
        },
      });
      // console.log('result : ', result);
      if (result.status === 200 && result.data && !result.data.error) {
        ctx.session.githubAuth = result.data; //存入session
        const { access_token, token_type } = result.data;

        //获取用户信息,并存入userInfo session
        const userInfoResp = await axios({
          methods: 'GET',
          url: 'https://api.github.com/user',
          headers: {
            Authorization: `${token_type} ${access_token}`,
          },
        }); //请求头里有空格！

        ctx.session.userInfo = userInfoResp.data;
        // console.log('user Info ：', userInfoResp.data);
        ctx.redirect(
          ctx.session && ctx.session.urlBeforeAuth
            ? ctx.session.urlBeforeAuth
            : '/'
        );
        //获取用户信息完成后重定向性，失败则跳转主页
        if (ctx.session) {
          ctx.session.urlBeforeAuth = '';
        }
      } else {
        const errorMsg = result.data && result.data.error;
        ctx.body = `request token failed ${errorMsg}`;
      }
    } else {
      //不是auth就进入下一个中间件
      await next();
    }
  });

  server.use(async (ctx, next) => {
    const { path, method } = ctx;
    if (path === '/logout' && method === 'POST') {
      ctx.session = null;
      ctx.body = 'logout success';
    } else {
      await next();
    }
  });

  server.use(async (ctx, next) => {
    const { path, method } = ctx;
    //记录并保持授权登录前的页面地址
    if (path === '/prepare-auth' && method === 'GET') {
      const { url } = ctx.query;
      ctx.session.urlBeforeAuth = url;
      ctx.redirect(`${config.OAUTH_URL}`);
      //重定向去验证授权界面
    } else {
      await next();
    }
  });
};
