module.exports = {
  webpackDevMiddleware: (config) => {
    config.watchOptions.poll = 300;
    return config;
  },
  allowedDevOrigins: ['ticketing.dev', 'http://ticketing.dev', 'https://ticketing.dev'],
};
