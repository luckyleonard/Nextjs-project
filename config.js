require('dotenv').config();
const { CLIENT_ID, CLIENT_SECRET } = process.env;

module.exports = {
  github: {
    request_token_url: 'https://github.com/login/oauth/access_token',
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
  },
};
