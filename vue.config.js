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

function resolve(dir) {
  return path.join(__dirname, dir);
}
const name = defaultSettings.title || "诸暨智慧公路BIM大数据管理平台"; // page title
// const port = process.env.port || process.env.npm_config_port || 9011 // dev port
module.exports = {
  publicPath: "/zjBIM",
  outputDir: "zjBIM",
  assetsDir: "static",
  // lintOnSave: process.env.NODE_ENV === 'development',
  // productionSourceMap: false,
  lintOnSave: false,
  devServer: {
    open: true,
    proxy: {
      "/STSfmzj": {
        // target: 'https://system.zlskkj.com:59030',
        target: "http://101.200.223.171:8085",
        changeOrigin: true,
        //               secure:true          //https需要开启此配置
        //               ws: true,             //是否启用websockets
        pathRewrite: {
          // '^/STSfmzj': ''
        }
      },
      "/ZhuJiRoad": {
        target: 'http://101.200.223.171:8085',
        // target: 'https://system.zlskkj.com:59030',
        // target: "http://192.168.2.122:8720",
        changeOrigin: true,
        pathRewrite: {
          // "^/ZhuJiRoad": ""
        }
      },
      "/zlsk_js_api": {
        // target: "http://101.200.223.171:8085",
        target: "http://192.168.2.163:9010",
        changeOrigin: true,
        secure: true,
        pathRewrite: {}
      },
		"/ZhuJiApi": {
		  target: "http://101.200.223.171/ZhuJiApi",
		  changeOrigin: true,
		  secure: true,
		  pathRewrite: {}
		}
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
