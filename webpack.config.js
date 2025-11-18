const webpack = require('webpack')
const path = require('path')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

module.exports = (env, argv) => {
    const isDevelopment = argv.mode === 'development'

    return {
        entry: `./src/ts/index.tsx`,
        output: {
            filename: 'main.min.js',
            path: path.resolve(__dirname, 'public'),
            publicPath: '/',
        },
        module: {
            rules: [
                {
                    test: /\.(js|jsx)$/,
                    exclude: /node_modules/,
                    use: {
                        loader: 'babel-loader',
                    },
                },
                {
                    test: /\.css$/i,
                    use: [
                        isDevelopment ? 'style-loader' : MiniCssExtractPlugin.loader,
                        'css-loader'
                    ],
                },
                {
                    test: /\.s[ac]ss$/i,
                    use: [
                        isDevelopment ? 'style-loader' : MiniCssExtractPlugin.loader,
                        'css-loader',
                        'sass-loader'
                    ],
                },
                {
                    test: /\.(ts|tsx)$/,
                    exclude: /node_modules/,
                    use: 'ts-loader',
                },
            ],
        },
        resolve: {
            extensions: ['.ts', '.tsx', '.js', '.jsx'],
        },
        plugins: [
            new webpack.ProgressPlugin(),
            new CleanWebpackPlugin({
                cleanOnceBeforeBuildPatterns: ['**/*.js', '**/*.css', '**/*.js.map', '**/*.css.map'],
                cleanAfterEveryBuildPatterns: [],
            }),
            new MiniCssExtractPlugin(),
        ],
        performance: {
            //hints: false,
            maxEntrypointSize: 512 * 1024,
            maxAssetSize: 512 * 1024,
        },
        devServer: {
            static: {
                directory: path.join(__dirname, 'public'),
            },
            compress: true,
            port: 3000,
            hot: true,
            liveReload: true,
            open: true,
            watchFiles: ['src/**/*', 'public/**/*'],
            client: {
                overlay: {
                    errors: true,
                    warnings: false,
                },
                progress: true,
            },
            proxy: [
                {
                    context: ['/face'],
                    target: 'http://localhost:8080',
                    changeOrigin: true,
                },
                {
                    context: ['/health-check'],
                    target: 'http://localhost:8080',
                    changeOrigin: true,
                },
            ],
        },
    }
}
