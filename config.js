require('dotenv').config();
const { CLIENT_ID, CLIENT_SECRET } = process.env;
const GITHUB_OAUTH_URL = 'https://github.com/login/oauth/authorize';
const SCOPE = 'user';

module.exports = {
  github: {
    request_token_url: 'https://github.com/login/oauth/access_token',
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
  },
  redis: {
    port: 6379,
    host: '192.168.99.100',
  },
  GITHUB_OAUTH_URL,
  OAUTH_URL: `${GITHUB_OAUTH_URL}?client_id=${CLIENT_ID}&scope=${SCOPE}`,
};
