const path = require('path');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = (env, argv) => {
  const mode = env.NODE_ENV;
  const isProd = argv.mode === 'production';

  return {
    mode,
    context: path.resolve(__dirname, 'src'),
    entry: './js/main.js',
    output: {
      path: path.resolve(__dirname, 'build'),
      filename: isProd ? 'js/[name].[hash].js' : 'js/[name].js',
      clean: true,
    },
    module: {
      rules: [
        {
          test: /\.(?:js|mjs|cjs)$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: [
                ['@babel/preset-env', { targets: 'defaults' }]
              ]
            }
          }
        },
        {
          test: /\.(c|sa|sc)ss$/i,
          use: [
            MiniCssExtractPlugin.loader,
            'css-loader',
            {
              loader: "postcss-loader",
              options: {
                postcssOptions: {
                  plugins: [
                    [
                      'postcss-preset-env',
                    ],
                  ],
                },
              },
            },
            'sass-loader',
          ],
        },
        {
          test: /\.(png|svg|jpg|jpeg|gif|webp)$/i,
          type: 'asset/resource',
          use: !isProd
            ? []
            : [
              {
                loader: 'image-webpack-loader',
                options: {
                  mozjpeg: {
                    progressive: true,
                  },
                  optipng: {
                    enabled: false,
                  },
                  pngquant: {
                    quality: [0.65, 0.9],
                    speed: 4,
                  },
                  gifsicle: {
                    interlaced: false,
                  },
                  webp: {
                    quality: 75,
                  },
                },
              },
            ],
          generator: {
            filename: 'img/[name][ext]',
          }
        },
        {
          test: /\.ico$/i,
          type: 'asset/resource',
          generator: {
            filename: '[name][ext]',
          },
        },
        {
          test: /\.html$/i,
          loader: 'html-loader',
        },
        {
          test: /\.(woff|woff2|eot|ttf|otf)$/i,
          type: 'asset/resource',
          generator: {
            filename: 'fonts/[name][ext]',
          }
        },
      ],
    },
    resolve: {
      extensions: ['.js', '.css', '.scss']
    },
    optimization: {
      minimize: true,
      splitChunks: {
        chunks: 'all',
      },
      minimizer: [
        new CssMinimizerPlugin(
          {
            minimizerOptions: {
              preset: [
                'default',
                {
                  discardComments: { removeAll: true },
                },
              ],
            },
          }
        ),
        new TerserPlugin(),
      ]
    },
    devServer: {
      port: 5001,
      open: true,
      hot: true,
      compress: true,
      static: {
        directory: path.join(__dirname, 'public'),
      }
    },
    plugins: [
      new HTMLWebpackPlugin({
        template: './index.html'
      }),
      new MiniCssExtractPlugin({
        filename: isProd ? 'css/[name].[hash].css' : 'css/[name].css',
      }),
    ],
  }
};

