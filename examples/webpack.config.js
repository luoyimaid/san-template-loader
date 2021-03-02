/**
 * Copyright (c) Baidu Inc. All rights reserved.
 *
 * This source code is licensed under the MIT license.
 * See LICENSE file in the project root for license information.
 *
 * @file webpack.config.js
 * @author clark-t
 */

const webpack = require('webpack');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
    entry: path.resolve(__dirname, './index.js'),
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist')
    },
    devtool: 'source',
    // devtool: false,
    mode: 'development',
    watch: true,
    module: {
        rules: [
            {
                test: /\.js$/,
                use: [
                    {
                        loader: 'babel-loader',
                        options: {
                            plugins: [
                                require.resolve('@babel/plugin-proposal-class-properties')
                                // require.resolve('san-hot-loader/lib/babel-plugin')
                            ],
                            presets: [
                                [
                                    require.resolve('@babel/preset-env'),
                                    {
                                        targets: {
                                            browsers: '> 1%, last 2 versions'
                                        },
                                        modules: false
                                    }
                                ]
                            ]
                        }
                    },
                    {
                        loader: path.resolve(__dirname, '../index.js'),
                        options: {
                            compileTemplate: 'aPack',
                            mode: 'compact'
                        }
                    }
                ]
            },
            {
                test: /\.less$/,
                oneOf: [
                    // 这里匹配 `<style lang="less" module>`
                    {
                        resourceQuery: /module/,
                        use: [
                            'style-loader',
                            {
                                loader: 'css-loader',
                                options: {
                                    modules: {
                                        localIdentName: '[local]_[hash:base64:5]'
                                    },
                                    localsConvention: 'camelCase',
                                    sourceMap: true
                                }
                            },
                            {
                                loader: 'less-loader',
                                options: {
                                    sourceMap: true
                                }
                            }
                        ]
                    },
                    // 这里匹配 `<style lang="less">`
                    {
                        use: [
                            {
                                loader: 'style-loader'
                            },
                            {
                                loader: 'css-loader',
                                options: {
                                    modules: {
                                        localIdentName: '[local]_[hash:base64:5]'
                                    },
                                    localsConvention: 'camelCase',
                                    sourceMap: true
                                }
                            },
                            {
                                loader: 'less-loader',
                                options: {
                                    sourceMap: true
                                }
                            }
                        ]
                    }
                ]
            },
            {
                test: /\.css$/,
                oneOf: [
                    // 这里匹配 `<style module>`
                    {
                        resourceQuery: /module/,
                        use: [
                            'style-loader',
                            {
                                loader: 'css-loader',
                                options: {
                                    modules: {
                                        localIdentName: '[local]_[hash:base64:5]'
                                    },
                                    localsConvention: 'camelCase',
                                    sourceMap: true
                                }
                            }
                        ]
                    },
                    // 这里匹配 `<style>`
                    {
                        use: [
                            {
                                loader: 'style-loader'
                            },
                            {
                                loader: 'css-loader',
                                options: {
                                    sourceMap: true
                                }
                            }
                        ]
                    }
                ]
            },
            {
                test: /\.html$/,
                use: [
                    {
                        loader: 'html-loader',
                        options: {
                            esModule: false,
                            minimize: false
                        }
                    }
                ]
            },
            {
                test: /\.(jpe?g|png)$/,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 6000,
                            name: 'img/[name]-[hash].[ext]',
                            esModule: false
                        }
                    }
                ]
            }
        ]
    },
    resolve: {
        extensions: ['.js', '.ts', '.san', '.json']
    },
    devServer: {
        contentBase: path.resolve(__dirname),
        overlay: true,
        hot: true,
        inline: true,
        port: 8080
    },
    plugins: [
        new HTMLWebpackPlugin({
            template: path.resolve(__dirname, './index.html')
        }),
        // new MiniCssExtractPlugin({
        //     filename: '[name].css',
        //     chunkFilename: '[id].css'
        // }),
        new webpack.NamedModulesPlugin(),
        new webpack.HotModuleReplacementPlugin()
    ]
};
