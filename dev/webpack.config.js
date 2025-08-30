const path = require('path');
const webpack = require('webpack');
const fs = require('fs');

module.exports = {
    context: __dirname + '/',
    entry: {
        'circleblockdrop.min': './plugin/circleblockdrop.js',
    },
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, './../public'),
    },
    externals: {
        $: '$',
        jquery: 'jQuery',
        Popper: ['popper.js', 'default']
    },
    optimization: {
        minimize: true,
    },
    plugins: [
        new webpack.ContextReplacementPlugin(/node_modules\/moment\/locale/, /ru|en-gb/), //указываем какие файлы подгружать модулем "moment"
        new webpack.BannerPlugin(fs.readFileSync('./../public/LICENSE', 'utf8')),
    ]
};