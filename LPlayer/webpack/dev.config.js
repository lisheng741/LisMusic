

const path = require('path')
const webpack = require('webpack')

module.exports = {
    entry: {
        LPlayer: './src/js/index.js',
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
    devServer: {
        compress: true,
        contentBase: path.resolve(__dirname, '..', 'demo'),
        clientLogLevel: 'none',
        quiet: false,
        open: true,
        historyApiFallback: {
            disableDotRule: true,
        },
        watchOptions: {
            ignored: /node_modules/,
        },
    }
}
