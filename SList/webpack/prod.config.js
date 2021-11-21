
const path = require('path')
const webpack = require('webpack')

module.exports = {
    mode: 'production',

    devtool: 'source-map',

    entry: {
        SList: './src/js/index.js',
    },

    output: {
        path: path.resolve(__dirname, '..', 'dist'),
        filename: '[name].min.js',
        library: '[name]',
        libraryTarget: 'var',
        libraryExport: 'default',
        publicPath: '/',
    },

    resolve: {
        modules: ['node_modules'],
        extensions: ['.js', '.css'],
    },
    module: {
        strictExportPresence: true,
        rules: [
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader'],
            },
            {
                test: /\.art$/,
                loader: "art-template-loader"
            },
            {
                test: /\.svg$/,
                loader: 'svg-inline-loader',
            }
        ],
    },
    node: {
        dgram: 'empty',
        fs: 'empty',
        net: 'empty',
        tls: 'empty',
    }
}
