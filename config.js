// console.log('from config', process.env);
// const { CLIENT_ID, CLIENT_SECRET } = process.env;
// console.log('clinetid:', CLIENT_ID, 'clinetsecret:', CLIENT_SECRET);
const GITHUB_OAUTH_URL = 'https://github.com/login/oauth/authorize';
const SCOPE = 'user';

module.exports = {
  github: {
    github_base_url: 'https://api.github.com',
    request_token_url: 'https://github.com/login/oauth/access_token',
    client_id: process.env.CLIENT_ID,
    client_secret: process.env.CLIENT_SECRET,
  },
  redis: {
    port: 6379,
    host: '192.168.99.100',
  },
  GITHUB_OAUTH_URL,
  OAUTH_URL: `${GITHUB_OAUTH_URL}?client_id=${process.env.CLIENT_ID}&scope=${SCOPE}`,
};
