module.exports = {
    configureWebpack: {
      module: {
        rules: [
          {
            test: /\.geojson$/,
            loader: 'json-loader'
          }
        ]
      }
    },
    pages: {
      index: {
        // entry for the page
        entry: 'src/main.js',
        title: 'PokémonGo Map - Suisse romande',
      },
    }
  }