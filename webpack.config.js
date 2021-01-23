module.exports = {
  mode: 'production',
  module: {
    rules: [
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
  entry: './src/index.ts',
  output: {
    filename: 'index.js',
    library: 'EditorJSInline',
    libraryExport: 'default',
    libraryTarget: 'umd',
  },
};
