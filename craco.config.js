const webpack = require('webpack');
const packageJson = require('./package.json');

function configureWebpack(webpackConfig, { env, paths }) {
  // fallbacks
  const fallback = webpackConfig.resolve.fallback || {};
  Object.assign(fallback, {
    crypto: require.resolve('crypto-browserify'),
    fs: require.resolve('browserify-fs'),
    stream: require.resolve('stream-browserify'),
    util: require.resolve('util'),
    path: require.resolve('path-browserify'),
    'process/browser': require.resolve('process/browser'),
    vm: require.resolve('vm-browserify'),
  });
  webpackConfig.resolve.fallback = fallback;

  webpackConfig.plugins = (webpackConfig.plugins || []).concat([
    new webpack.ProvidePlugin({
      process: 'process/browser',
      Buffer: ['buffer', 'Buffer'],
    }),
    // Set verion info from package.json
    new webpack.DefinePlugin({
      'process.env.APP_VERSION': JSON.stringify(packageJson.version),
    }),
  ]);

  webpackConfig.ignoreWarnings = [
    /Failed to parse source map/,
    function ignoreSourcemapsloaderWarnings(warning) {
      return (
        warning.module &&
        warning.module.resource.includes('node_modules') &&
        warning.details &&
        warning.details.includes('source-map-loader')
      );
    },
  ];

  return webpackConfig;
}

function configureCraco() {
  return {
    webpack: {
      configure: configureWebpack,
    },
  };
}

module.exports = configureCraco();
