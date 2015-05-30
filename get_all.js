var async = require('async');
var paginate = require('./paginate');
var debug = require('debug')('Assembling JSON');


module.exports = function (token, shouldGetTaggedPhotos, cb) {

  paginate(url('/me/albums'), function (err, albums) {

    if (err) { throw err; }

    // for each album, fill in all the photos objects
    async.map(albums, addPhotosToAlbum, function (err, albums) {
      if (err) { return cb(err); }

      if (!shouldGetTaggedPhotos) {
        debug('finished getting all albums. Not getting tagged photos');
        cb(null, albums)
      } else {
        paginate(url('/me/photos'), function(err, taggedPhotos) {
          if (err) { return cb(err); }

          debug('got all tagged photos.')

          cb(null, albums.concat({
            name: 'My Tagged Photos',
            photos: taggedPhotos
          }));
        });
      }
    });
  });

  // gets all photos from an album and append it to it
  function addPhotosToAlbum(album, cb) {

    if (!album.id) {
      cb(new Error('no album id found'))
    }

    debug('Getting photos to album with id: ' + album.id);

    paginate(url('/', album.id, '/photos'), function (err, photos) {
      if (err) { cb(err); }

      album.photos = photos;

      debug('finished getting photos to album with id: ' + album.id);

      cb(null, album);
    });
  }

  // ---------- helpers ----------

  function url() {
    var BASE_URL = 'https://graph.facebook.com/v2.3';
    var paths = [].slice.apply(arguments);

    return [BASE_URL].concat(paths).concat(['?access_token=', token]).join('');
  }
};
