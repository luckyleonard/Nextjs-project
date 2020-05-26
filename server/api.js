const { requestGithub } = require('../utils/apiHelper');

module.exports = (server) => {
  server.use(async (ctx, next) => {
    const { path, method } = ctx;
    if (path.startsWith('/github/')) {
      const session = ctx.session;
      const githubAuth = session && session.githubAuth;
      const url = ctx.url.replace('/github/', '/');
      const token = githubAuth && githubAuth.access_token;
      let headers = {};
      if (token) {
        headers[
          'Authorization'
        ] = `${githubAuth.token_type} ${githubAuth.access_token}`;
      }
      //必须使用requestGithub因为没有req,res 取不出req.session
      const result = await requestGithub(
        method,
        url,
        ctx.request.body || {},
        headers
      );

      //将github的返回结果直接返回
      ctx.status = result.status;
      ctx.body = result.data;
    } else {
      await next();
    }
  });
};
