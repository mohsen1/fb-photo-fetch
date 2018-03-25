var async = require("async");
var paginate = require("./paginate");
var debug = require("debug")("json");

module.exports = function(
  token,
  shouldGetAlbumPhotos,
  shouldGetTaggedPhotos,
  cb
) {
  paginate(url("/me/albums"), function(err, albums) {
    if (err) {
      throw err;
    }

    if (!shouldGetAlbumPhotos) albums = [];

    // for each album, fill in all the photos objects
    async.map(albums, addPhotosToAlbum, function(err, albums) {
      if (err) {
        return cb(err);
      }

      if (!shouldGetTaggedPhotos) {
        debug("finished getting all albums. Not getting tagged photos");
        cb(null, albums);
      } else {
        debug("getting tagged photos.");

        paginate(url("/me/photos"), function(err, taggedPhotos) {
          if (err) {
            return cb(err);
          }

          debug("got all tagged photos.");

          cb(
            null,
            albums.concat({
              name: "Photos of me (Tagged photos)",
              photos: taggedPhotos
            })
          );
        });
      }
    });
  });

  // gets all photos from an album and append it to it
  function addPhotosToAlbum(album, cb) {
    if (!album.id) {
      cb(new Error("no album id found"));
    }

    debug("Getting photos to album with id: " + album.id);

    paginate(
      url("/", album.id, "/photos").concat(
        "&fields=id,images,source,created_time"
      ),
      function(err, photos) {
        if (err) {
          return cb(err);
        }

        // TODO: paginate in likes and comments of each photo.

        album.photos = photos;

        debug("finished adding photos to album: " + album.name);

        cb(null, album);
      }
    );
  }

  // ---------- helpers ----------

  function url() {
    var BASE_URL = "https://graph.facebook.com/v2.3";
    var paths = [].slice.apply(arguments);

    return [BASE_URL]
      .concat(paths)
      .concat(["?access_token=", token])
      .join("");
  }
};
