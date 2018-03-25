var fs = require("fs");
var path = require("path");

var argv = require("minimist")(process.argv.slice(2), {
  default: { albums: true }
});
var dest = argv.dest || path.join(__dirname, "photos");
var token = argv.token;

if (!token) {
  throw new Error("Please provide the token");
}

process.env.DEBUG = argv.debug || process.env.DEBUG;

var getAll = require("./get_all");
var download = require("./download");

var sinceDate = require("moment")(argv.sinceDate, "YYYY/MM/DD");
if (!sinceDate.isValid()) {
  require("debug")("download")(
    "invalid sinceDate '" +
      argv.sinceDate +
      "', date filter disabled (get all)."
  );
  sinceDate = 0;
}

var photoSelector = function(photo) {
  var includePhoto = !sinceDate || Date.parse(photo.created_time) > sinceDate;
  return includePhoto;
};

getAll(token, argv.albums, argv.tagged, function(err, result) {
  if (err) {
    throw err;
  }

  fs.writeFileSync("result.json", JSON.stringify(result, null, 4));

  download(result, dest, photoSelector);
});
