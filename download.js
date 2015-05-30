var fs = require('fs');
var async = require('async');
var path = require('path');
var debug = require('debug')('Download');
var request = require('request');
var mkdirp = require('mkdirp');

module.exports = function(albums, dest) {

  mkdirp.sync(dest);

  async.each(albums, downloadAlbum, function(err) {
    if (err) throw err;

    debug('Finished downloading all albums');
  });

  function downloadAlbum(album, dlAlbumCb) {
    var albumPath = path.join(dest, album.name);

    mkdirp.sync(albumPath);

    async.each(album.photos, downloadPhoto, function (err) {
      debug('Finished downloading ' + album.name);
      dlAlbumCb(err);
    });

    function downloadPhoto(photo, cb) {

      request(photo.images[0].source)
        .on('response', function (res) {
          res.pipe(fs.createWriteStream(path.join(albumPath, photo.id + '.jpg')))
          .on('error', console.log)
          .on('end', cb);
        })
        .on('error', console.log);
    }
  }
};