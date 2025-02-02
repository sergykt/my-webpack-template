const path = require("path");
const HTMLWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const ImageMinimizerPlugin = require("image-minimizer-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const ESLintPlugin = require("eslint-webpack-plugin");
const StylelintPlugin = require("stylelint-webpack-plugin");
const tailwindcss = require("tailwindcss");

module.exports = (env, argv) => {
  const mode = env.NODE_ENV;
  const isProd = argv.mode === "production";

  return {
    mode,
    context: path.resolve(__dirname, "src"),
    entry: "./js/main.js",
    output: {
      path: path.resolve(__dirname, "build"),
      filename: isProd ? "js/[name].[contenthash].js" : "js/[name].js",
      clean: true,
    },
    resolve: {
      extensions: [".js", ".css", ".scss", ".svg"],
      alias: {
        "@svg": path.resolve(__dirname, "src", "img", "svg"),
      },
    },
    module: {
      rules: [
        {
          test: /\.(?:js|mjs|cjs)$/,
          exclude: /node_modules/,
          use: {
            loader: "babel-loader",
            options: {
              presets: [["@babel/preset-env", { targets: "defaults" }]],
            },
          },
        },
        {
          test: /\.(c|sa|sc)ss$/i,
          use: [
            MiniCssExtractPlugin.loader,
            "css-loader",
            {
              loader: "postcss-loader",
              options: {
                postcssOptions: {
                  plugins: ["postcss-preset-env", tailwindcss],
                },
              },
            },
            "sass-loader",
          ],
        },
        {
          test: /\.(jpe?g|png|gif|svg|webp)$/i,
          type: "asset/resource",
          generator: {
            filename: "img/[name][ext]",
          },
        },
        {
          test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)$/i,
          type: "asset/resource",
          generator: {
            filename: "media/[name][ext]",
          },
        },
        {
          test: /\.ico$/i,
          type: "asset/resource",
          generator: {
            filename: "[name][ext]",
          },
        },
        {
          test: /\.(woff|woff2|eot|ttf|otf)$/i,
          type: "asset/resource",
          generator: {
            filename: "fonts/[name][ext]",
          },
        },
      ],
    },
    optimization: {
      minimize: true,
      splitChunks: {
        chunks: "all",
      },
      minimizer: [
        new CssMinimizerPlugin({
          minimizerOptions: {
            preset: [
              "default",
              {
                discardComments: { removeAll: true },
              },
            ],
          },
        }),
        new TerserPlugin(),
        new ImageMinimizerPlugin({
          minimizer: {
            implementation: ImageMinimizerPlugin.sharpMinify,
            options: {
              encodeOptions: {},
            },
          },
        }),
      ],
    },
    devServer: {
      port: 5001,
      open: true,
      hot: true,
      compress: true,
      static: {
        directory: path.join(__dirname, "src"),
      },
    },
    plugins: [
      new HTMLWebpackPlugin({
        template: "./index.html",
        filename: "index.html",
        title: "Webpack template",
        favicon: "./assets/favicon.ico",
      }),
      new MiniCssExtractPlugin({
        filename: isProd ? "css/[name].[contenthash].css" : "css/[name].css",
      }),
      new ESLintPlugin(),
      new StylelintPlugin({
        files: "**/*.(s(c|a)ss|css)",
        configFile: "./.stylelintrc.json",
      }),
    ],
  };
};
