/**
 * Builds the DLL for development electron renderer process
 */

import webpack from 'webpack';
import path from 'path';
import { merge } from 'webpack-merge';
import baseConfig from './webpack.config.base';
import { dependencies } from '../package.json';
import checkNodeEnv from './scripts/check-node-env';
import { APP_PATH, DLL_PATH, SRC_PATH } from './webpack.pathes';

checkNodeEnv('development');

const dist = DLL_PATH;

const configuration: webpack.Configuration = {
  context: APP_PATH,

  devtool: 'eval',

  mode: 'development',

  target: 'electron-renderer',

  externals: ['fsevents', 'crypto-browserify', 'sleep'],

  /**
   * Use `module` from `webpack.config.renderer.dev.js`
   */
  module: require('./webpack.renderer.dev.config').default.module,

  entry: {
    renderer: Object.keys(dependencies || {}),
  },

  output: {
    path: dist,
    filename: '[name].dev.dll.js',
    library: {
      name: 'renderer',
      type: 'var',
    },
  },

  plugins: [
    new webpack.DllPlugin({
      path: path.join(dist, '[name].json'),
      name: '[name]',
    }),

    /**
     * Create global constants which can be configured at compile time.
     *
     * Useful for allowing different behaviour between development builds and
     * release builds
     *
     * NODE_ENV should be production so that modules do not perform certain
     * development checks
     */
    new webpack.EnvironmentPlugin({
      NODE_ENV: 'development',
    }),

    new webpack.LoaderOptionsPlugin({
      debug: true,
      options: {
        context: SRC_PATH,
        output: {
          path: DLL_PATH,
        },
      },
    }),
  ],
};

export default merge(baseConfig, configuration);
