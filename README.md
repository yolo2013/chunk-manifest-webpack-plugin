# chunk-manifest-inject2html-webpack-plugin

The only difference is when you use [html-webpack-plugin](https://github.com/jantimon/html-webpack-plugin#events). It will inject the manifest json to you html instead of generate a json file. So you can cache the runtime file even manifest file changed everytime.

> Use [chunk-manifest-webpack-plugin](https://github.com/soundcloud/chunk-manifest-webpack-plugin) instead if you don't need this further.
## Usage

Install via npm:

```shell
npm install chunk-manifest-inject2html-webpack-plugin
```

Install via yarn:

```shell
yarn add chunk-manifest-inject2html-webpack-plugin
```

And then require and provide to webpack:

```javascript
// in webpack.config.js or similar
var ChunkManifestPlugin = require('chunk-manifest-inject2html-webpack-plugin');

module.exports = {
  // your config values here
  plugins: [
    new ChunkManifestPlugin()
  ]
};
```

### Options

#### `file`
Generate manifest json file or not. Default = `false`

#### `filename`

Where the manifest will be exported to on bundle compilation. This will be relative to the main webpack output directory. Default = `"manifest.json"`

#### `manifestVariable`

What JS variable on the client webpack should refer to when requiring chunks. Default = `"webpackManifest"`
