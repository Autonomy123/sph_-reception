module.exports = {
    // 关闭eslint提示工具
    lintOnSave:false ,
    // 代理跨域
    devServer: {
        proxy: {
          '/api': {
            target: 'http://39.98.123.211', //配置后端服务器的地址
            // pathRewrite: { '^/api': '' }, 接口带api字眼 所以得注释掉这行
          },
        },
      },
}