var webpack = require('webpack');
var path = require('path');
// require("@babel/polyfill");
var HtmlWebpackPlugin = require('html-webpack-plugin');
var UglifyJsPlugin = require('uglifyjs-webpack-plugin');
module.exports = function (env) {
    const config = {
        entry: {
            // "app": ["@babel/polyfill","./src/browser/index.jsx",],
            "app": "./src/browser/index.jsx",
            "verdor": ["react", "react-dom", "react-router-dom", "mobx", "mobx-react", "axios", "moment", "lodash"]
        },
        output: {
            filename: "app.bundle.[hash].js",
            path: path.join(__dirname, './dist/fe'),
            publicPath: "/"
        },
        devtool: "eval-source-map",
        resolve: {
            extensions: [".webpack.js", ".jsx", ".web.js", ".js"]
        },
        module: {
            loaders: [{
                    test: /\.js|jsx?$/,
                    exclude: /(node_modules)/,
                    loader: 'babel-loader',
                    query: {
                        presets: ['react', 'es2015', 'stage-0'],
                        plugins: [
                            ["import", {
                                "libraryName": "antd",
                                "libraryDirectory": "es",
                                "style": true
                            }],
                            ["transform-decorators-legacy"],
                            ["transform-class-properties"],
                            [
                                "transform-runtime",
                                {
                                    "helpers": false,
                                    "polyfill": false,
                                    "regenerator": true,
                                    "moduleName": "babel-runtime"
                                }
                            ]
                        ]
                    }
                },
                {
                    enforce: "pre",
                    test: /\.js$/,
                    loader: "source-map-loader"
                },
                {
                    test: /\.css$/,
                    loader: 'style-loader!css-loader?sourceMap-loader'
                },
                {
                    test: /\.less$/,
                    // loader: 'style-loader!css-loader?sourceMap-loader!less-loader',
                    use: [{
                        loader: 'style-loader',
                    }, {
                        loader: 'css-loader', // translates CSS into CommonJS
                    }, {
                        loader: 'less-loader', // compiles Less to CSS
                        options: {
                            modifyVars: {
                                // https://github.com/ant-design/ant-design/blob/master/components/style/themes/default.less
                                "@icon-url": "'http://update.bjsasc.com/iconfont/iconfont'", // 因为是内网环境 ， 所以需要手动指定icon 位置， antd 字体图标 依赖于公网
                                "@primary-color": "#3383da", // 测试修改主题
                                "@border-color-base": "#666",
                                "@table-padding-vertical": "5px",
                                // "@border-color-split": "#bfbfbf",
                                 "@border-color-split": "#666",
                                // "@disabled-color":"#a5a0a0",
                                "@card-padding-base": "8px",
                                "@card-head-padding": "8px",
                                "@table-header-bg": "#e8e8e8"
                            },
                            javascriptEnabled: true,
                        }
                    }]
                },
                {
                    test: /\.(png|jpg|jpeg|gif|svg|woff|woff2|ttf|eot)$/,
                    loader: "url-loader?limit=8192&name=./images/[hash:8].[ext]"
                } //把不大于8kb的图片打包处理成Base64
            ]
        },
        resolveLoader: {
            modules: ['node_modules', 'loader']
        },
        plugins: [
            new webpack.optimize.CommonsChunkPlugin({
                name: "verdor",
                filename: "verdor.bundle.js"
            }),
            new HtmlWebpackPlugin({
                template: __dirname + "/src/browser/index.tmpl.html" //new 一个这个插件的实例，并传入相关的参数
            }),
            new webpack.HotModuleReplacementPlugin(), //热加载插件
        ],
        devServer: {
            contentBase: "./",
            compress: true,
            port: 9000,
            host: '0.0.0.0',
            historyApiFallback: true,
            inline: true,
            hot: true
        }
    };
    try {
        if (env.os == 'xp') {
            config.module.loaders.push({
                test: /\.js|jsx?$/,
                loader: 'asp-os-loader'
            }, )
            config.output.path = path.join(__dirname, './xpdist/fe');
        }
        if (env.prod) {
            // 当前为生产环境
            config.devtool = false;
            config.output.publicPath = './';
            config.plugins.push(new UglifyJsPlugin())
        } else {
            //当前为开发环境
        }
    } catch (error) {
        console.log("当前为开发环境");
    }
    return config;
}