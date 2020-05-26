const axios = require('axios');
const config = require('../config');
const isServer = typeof window === 'undefined';

async function requestGithub(method, url, data, headers) {
  return await axios({
    url: `${config.github.github_base_url}${url}`,
    method,
    data,
    headers,
  });
}

//res和req只有在服务器端渲染时,且一定是在渲染页面时才能有值
async function api_request({ method = 'GET', url, data = {} }, req, res) {
  if (!url) {
    throw Error('Url must be provided!');
  }

  if (isServer) {
    const session = req.session;
    const githubAuth = session.githubAuth || {};
    const headers = {};
    if (githubAuth.access_token) {
      headers[
        'Authorization'
      ] = `${githubAuth.token_type} ${githubAuth.access_token}`;
    }
    return await requestGithub(method, url, data, headers);
    //从服务端发出的请求 携带req.session里的githubAuth
  } else {
    //客户端可直接发起请求,之后被后端/github中间件拦截，然后在中间件中添加authorization
    return await axios({
      method,
      url: `/github${url}`,
      data,
    });
  }
}

module.exports = {
  api_request,
  requestGithub,
};
