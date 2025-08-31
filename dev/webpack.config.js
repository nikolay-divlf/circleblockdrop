const path = require('path');
const webpack = require('webpack');
//const fs = require('fs');

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
        new webpack.ContextReplacementPlugin(/node_modules\/moment\/locale/, /ru|en-gb/),
        //new webpack.BannerPlugin(fs.readFileSync('./../LICENSE', 'utf8')),
        new webpack.BannerPlugin(
            {
                banner: '/**! \n' +
                '* circleblockdrop v2.0 | divleaf.ru | https://github.com/nikolay-divlf/circleblockdrop\n' +
                '* @author Goryachev Nikolay\n' +
                '* @copyright NG 29-08-2025\n' +
                '* @license MIT \n*/',
                raw: true,
            }
        ),
    ]
};