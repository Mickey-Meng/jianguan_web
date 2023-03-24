/*
 * @Descripttion:
 * @version:
 * @Author: WangHarry
 * @Date: 2021-09-08 09:11:33
 * @LastEditors: WangHarry
 * @LastEditTime: 2022-05-06 11:41:17
 */

const path = require("path");
const defaultSettings = require("./src/settings.js");
const webpack = require("webpack");

function resolve(dir) {
  return path.join(__dirname, dir);
}

const name = defaultSettings.title || "诸暨智慧公路BIM大数据管理平台"; // page title
// const port = process.env.port || process.env.npm_config_port || 9011 // dev port
module.exports = {
  publicPath: "/",
  outputDir: "zjBIM",
  assetsDir: "static",
  // lintOnSave: process.env.NODE_ENV === 'development',
  // productionSourceMap: false,
  lintOnSave: false,
  devServer: {
    open: true,
    proxy: {
      "/STSfmzj": {
        // target: 'http://localhost:8081/',
        target: 'http://127.0.0.1:9001/STSfmzj',
        changeOrigin: true,
        //               secure:true          //https需要开启此配置
        //               ws: true,             //是否启用websockets
        pathRewrite: {
          '^/STSfmzj': ''
        }
      },
      "/ZhuJiRoad": {
        // target: "http://150.158.139.18:8081",
        target: 'http://127.0.0.1:8720/ZhuJiRoad',
        // target: 'http://150.158.139.18:8901/ZhuJiRoad',
        changeOrigin: true,
        pathRewrite: {
          "^/ZhuJiRoad": ""
        }
      },
      "/zlsk_js_api": {
        // target: 'http://localhost:8081/',
        // target: 'http://150.158.139.18:8181/',
        target: 'https://system.zlskkj.com:59031',
        changeOrigin: true,
        secure: true,
        pathRewrite: {}
      },
      "/ZhuJiApi": {
        target: "http://127.0.0.1:8876/ZhuJiApi",
        // target: "http://150.158.139.18:8901/ZhuJiApi",
        changeOrigin: true,
        pathRewrite: {
          "^/ZhuJiApi": ""
        }
      },
    }
  },
  configureWebpack: {
    name: name,
    devtool: "eval-source-map", // Debugger for Chrome配置项
    resolve: {
      alias: {
        "@": resolve("src")
      }
    }
  },
  chainWebpack(config) {
    config.plugin("provide").use(webpack.ProvidePlugin, [{
      "window.Quill": "quill/dist/quill.js",
      "Quill": "quill/dist/quill.js"
    }]);
    config.module
      .rule("svg")
      .exclude.add(resolve("src/icons"))
      .end();
    config.module
      .rule("icons")
      .test(/\.svg$/)
      .include.add(resolve("src/icons"))
      .end()
      .use("svg-sprite-loader")
      .loader("svg-sprite-loader")
      .options({
        symbolId: "icon-[name]"
      })
      .end();
  }
};
