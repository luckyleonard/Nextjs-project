const withCss = require('@zeit/next-css');
const config = require('./config');

if (typeof require !== 'undefined') {
  require.extensions['.css'] = (file) => {};
}

const configs = {
  //编译文件的输出目录 替代.next文件夹
  distDir: 'dest',
  //是否每个路由生成Etag，缓存映射 可以使用Nginx的Etag映射代替
  generateEtags: true,
  // 页面内容缓存配置，本地开发时
  onDemandEntries: {
    // 内容在内存中缓存的时长（ms）
    maxInactive: 25 * 1000,
    // 同时缓存多少个页面
    pagesBufferLength: 2,
  },
  // 在pages目录下哪种后缀的文件会被认为是页面
  pageExtensions: ['jsx', 'js'],
  //配置buildId 多节点部署时可能会被用到
  generateBuildId: async () => {
    if (process.env.YOUR_BUILD_ID) {
      return process.env.YOUR_BUILD_ID;
    }
    //返回null使用默认的unique ID
    return null;
  },
  //手动修改webpack config
  webpack(config, options) {
    return config;
  },
  //修改webpackDevMiddleware配置
  webpackDevMiddleware: (config) => {
    return config;
  },
  //可以在页面上通过process.env.customKey 获取value
  env: {
    NODE_ENV: 'development',
  },
  //下面两个要通过'next/config'包 来读取
  //只有在服务端渲染时才会获取的配置
  serverRuntimeConfig: {
    mySecret: 'secret',
    secondSecret: process.env.SECOND_SECRET,
  },
  //在服务端渲染和客户端渲染都可获取的配置
  publicRuntimeConfig: {
    staticFolder: '/static',
  },
};
module.exports = withCss({
  publicRuntimeConfig: {
    GITHUB_OAUTH_URL: config.GITHUB_OAUTH_URL,
    OAUTH_URL: config.OAUTH_URL,
  },
});
