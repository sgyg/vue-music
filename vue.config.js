const { resolve } = require("path");

module.exports = {
  chainWebpack: config => {
    // 设置快捷路径， @ 表示 'src' ，components 表示 'src/components'
    config.resolve.alias
      .set("@", resolve("./src"))
      .set("components", resolve("./src/components"))
      .set("common", resolve("./src/common"))
      .set("base", resolve("./src/base"))
      .set("api", resolve("./src/api"));
  },
  devServer: {
    open: true,
    proxy: {
      "/api": {
        target: "http://localhost:3000"
      }
    }
  }
};
