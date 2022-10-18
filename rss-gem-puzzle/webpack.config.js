const path = require('path');
const PugPlugin = require('pug-plugin');
// const CopyWebpackPlugin = require('copy-webpack-plugin');
const ghpages = require('gh-pages');
ghpages.publish(path.join(__dirname, 'dist'), {
  dest: 'rss-gem-puzzle',
  message: 'Deploy to GitHub Pages',
}, (err) => { console.log('GH-Pages error:', err) })


const devServer = (isDev) => !isDev ? {} : {
  devServer: {
    open: false,
    hot: true,
    port: 8080,
    compress: true,
    // static: './src/favicon.ico',
    watchFiles: {
      paths: ['src/**/*.*'],
      options: {
        usePolling: true
      }
    },
  },
  optimization: {
    minimize: false,
  },
  stats: 'errors-only'
}

module.exports = ({ dev }) => ({
  mode: dev ? 'development' : 'production',
  devtool: dev ? 'inline-source-map' : 'source-map',
  entry: {
    index: './src/index.pug'
  },
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'assets/js/[name].[contenthash:8].js', // output filename of JS files
    clean: true
  },
  optimization: {
    minimize: true,
  },
  resolve: {
    alias: {
      Img: '/src/assets/img/',
      Js: '/src/js/',
      Scss: '/src/scss/',
    },
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
        generator: {
          filename: 'assets/img/[name][ext]'
        }
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

        use: ['css-loader', {
          loader: "sass-loader",
          options: {
            sassOptions: {
              outputStyle: "compressed",
            },
          },
        },
        ]
      },
    ]
  },
  plugins: [
    new PugPlugin({
      pretty: true,
      extractCss: {
        filename: 'assets/css/[name].[contenthash:8].css'
      },
    }),
    // new CopyWebpackPlugin({
    //   patterns: [
    //     { from: './src/favicon.ico' }, // <- your path to favicon
    //   ]
    // })
  ],
  ...devServer(dev),
});