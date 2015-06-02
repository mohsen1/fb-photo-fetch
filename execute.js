var getAll = require('./get_all');
var download = require('./download');


module.exports = function execute(token, tagged, dest, cb, progressCb){
  getAll(token, tagged, function (err, result) {
    if (err) { return cb(err); }

    var count = result.reduce(function (count, album) {
      return album.photos.length + count;
    }, 0);

    download(result, dest, cb, progressCb, count);
  });
};