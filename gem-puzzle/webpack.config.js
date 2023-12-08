const path = require('path');
const PugPlugin = require('pug-plugin');
const CompressionPlugin = require("compression-webpack-plugin");
const CopyWebpackPlugin = require('copy-webpack-plugin');

const pages = ['index'];
const aliases = {
  Js: path.resolve(__dirname, 'src/js/'),
  Scss: path.resolve(__dirname, 'src/scss/'),
}


const devServer = (isDev) => isDev ? {
  devServer: {
    open: false,
    hot: false,
    port: 9000,
    compress: false,
    watchFiles: {
      paths: ['src/**/*.*'],
      options: {
        usePolling: true
      }
    },
    static: {
      directory: path.resolve(__dirname, 'dist'),
    },
  },
  // stats: 'errors-only'
} : {}


module.exports = ({ isDev }) => ({
  mode: isDev ? 'development' : 'production',
  devtool: isDev ? 'inline-source-map' : 'source-map',
  entry: pages.reduce((config, page) => {
    config[page] = `./src/${page}.pug`;
    return config;
  }, {}),
  output: {
    path: path.resolve(__dirname, 'dist'),
    // publicPath: '/',
    filename: 'assets/js/[name].[contenthash:8].js', // output filename of JS files
    clean: true
  },
  optimization: {
    splitChunks: {
      chunks: "all",
    },
    minimize: !isDev,
  },
  resolve: {
    alias: aliases,
  },
  module: {
    rules: [
      {
        test: /\.pug$/,
        loader: PugPlugin.loader,
      },
      {
        test: /\.(?:ico|gif|png|jpg|jpeg|webp|svg)$/i,
        type: 'asset/resource',
        use: {
          loader: 'responsive-loader',
          options: {
            name: 'assets/img/[name].[hash:8]-[width]w.[ext]',
            // sizes: [320, 640, 960, 1200, 1800, 2400],
            // quality: 85,
            format: 'webp',
          },
        },
      },
      {
        test: /\.(?:woff(2)?|eot|ttf|otf)$/i,
        type: 'asset/inline',
        generator: {
          filename: 'assets/fonts/[name][ext][query]'
        }
      },
      {
        test: /\.s[ac]ss$/i,
        use: ['css-loader',
          {
            loader: "sass-loader",
            options: {
              sourceMap: true,
              sassOptions: {
                outputStyle: "compressed",
              },
            },
          },
        ],
      },
    ]
  },
  plugins: [
    new CompressionPlugin({
      test: /\.(js|png|jpg|html|css)(\?.*)?$/i,
      // include: /\/assets/,
    }),
    new PugPlugin({
      pretty: isDev,
      extractCss: {
        filename: 'assets/css/[name].[contenthash:8].css'
      },
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, 'src/assets/adriantnt_u_click.mp3'),
          to: './assets/'
        }, 
        {
          from: path.resolve(__dirname, 'src/favicon.ico'),
          to: './'
        }, 
        {
          from: path.resolve(__dirname, 'src/assets/sound_on_icon.svg'),
          to: './assets/'
        },
        {
          from: path.resolve(__dirname, 'src/assets/sound_off_icon.svg'),
          to: './assets/'
        },
      ]
    })
  ],
  ...devServer(isDev),
});