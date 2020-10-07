const CracoLessPlugin = require('craco-less');

module.exports = {
  plugins: [
    {
      plugin: CracoLessPlugin,
      options: {
        lessLoaderOptions: {
          lessOptions: {
            modifyVars: {
                '@primary-color': '#BA9781',
                '@link-color': '#BA9781'
            },
            javascriptEnabled: true,
          },
        },
      },
    },
  ],
};