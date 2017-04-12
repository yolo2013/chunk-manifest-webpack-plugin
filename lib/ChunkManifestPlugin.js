var RawSource = require("webpack-core/lib/RawSource");
var cheerio = require('cheerio')

function ChunkManifestPlugin(options) {
  options = options || {};
  this.manifestFile = options.file || false
  this.manifestFilename = options.filename || "manifest.json";
  this.manifestVariable = options.manifestVariable || "webpackManifest";
}
module.exports = ChunkManifestPlugin;

ChunkManifestPlugin.prototype.constructor = ChunkManifestPlugin;
ChunkManifestPlugin.prototype.apply = function(compiler) {
  var manifestFilename = this.manifestFilename;
  var manifestVariable = this.manifestVariable;
  var manifestFile = this.manifestFile
  var oldChunkFilename;
  var chunkManifest;

  compiler.plugin("this-compilation", function(compilation) {
    var mainTemplate = compilation.mainTemplate;
    mainTemplate.plugin("require-ensure", function(_, chunk, hash) {
      var filename = this.outputOptions.chunkFilename || this.outputOptions.filename || 'manifest.json';


      if (filename) {
        chunkManifest = [chunk].reduce(function registerChunk(manifest, c) {
          if(c.id in manifest) return manifest;

          if(c.hasRuntime()) {
            manifest[c.id] = undefined;
          } else {
            manifest[c.id] = mainTemplate.applyPluginsWaterfall("asset-path", filename, {
              hash: hash,
              chunk: c
            });
          }
          return c.chunks.reduce(registerChunk, manifest);
        }, {});
        oldChunkFilename = this.outputOptions.chunkFilename;
        this.outputOptions.chunkFilename = "__CHUNK_MANIFEST__";
        // mark as asset for emitting

        if(manifestFile) {
          compilation.assets[manifestFilename] = new RawSource(JSON.stringify(chunkManifest));
        }
      }

      return _;
    });
  });

  compiler.plugin("compilation", function(compilation) {
    compilation.mainTemplate.plugin("require-ensure", function(_, chunk, hash, chunkIdVar) {
      if (oldChunkFilename) {
        this.outputOptions.chunkFilename = oldChunkFilename;
      }

      return _.replace("\"__CHUNK_MANIFEST__\"",
        "window[\"" + manifestVariable + "\"][" + chunkIdVar + "]");
    });

    compilation.plugin('html-webpack-plugin-after-html-processing', function(htmlPluginData, callback) {
        var $ = cheerio.load(htmlPluginData.html)

        $('head').append('<script>window.' + manifestVariable + '=' + JSON.stringify(chunkManifest) + '</script>')

        htmlPluginData.html = $.html()
        callback(null, htmlPluginData);
    })
  });
};
