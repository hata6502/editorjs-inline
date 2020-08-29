module.exports = {
  mode: 'production',
  module: {
    rules: [
      {
        test: /iframeWorker\.js$/,
        use: 'raw-loader',
      },
      {
        test: /\.tsx?$/,
        loader: 'ts-loader',
        options: {
          transpileOnly: true,
        },
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
  },
  entry: './src/iframeWorker.ts',
  output: {
    filename: 'iframeWorker.js',
  },
};
