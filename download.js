var fs = require('fs');
var async = require('async');
var path = require('path');
var debug = require('debug')('Download');
var request = require('request');
var mkdirp = require('mkdirp');

var addExif = require('./add_exif');

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
      var filePath = path.join(albumPath, photo.id + '.jpg');

      request(photo.images[0].source)
        .on('request', function (response) {
          streamToBuffer(response, function (err, buffer) {

            if (err) {
              return debug('Error converting ' + (photo.name || photo.id));
            }

            var result = addExif(photo, buffer.toString('binary'));

            fs.writeFile(filePath, result, 'binary', cb);
          });
        });
    }
  }
};