var piexif = require("piexifjs");
var toExifDate = require("to-exif-date");
var makeDescription = require("./make_description");
var makeLikes = require("./make_likes");
var makeTags = require("./make_tags");

var debug = require("debug")("exif");

module.exports = function(photo, file) {
  var zeroth = {};
  var exif = {};
  var gps = {};

  var date = toExifDate(new Date(photo.created_time));

  exif[piexif.ExifIFD.DateTimeOriginal] = date;
  gps[piexif.GPSIFD.GPSDateStamp] = date;
  gps[piexif.GPSIFD.GPSTimeStamp] = date;

  zeroth[piexif.ImageIFD.Make] = "Facebook Photo";

  var description =
    (photo.name || "") +
    "\n\n" +
    makeLikes(photo) +
    " liked this photo on Facebook" +
    "\n\nFacebook comments:\n\n" +
    makeDescription(photo) +
    "\n\nIn this photo: " +
    makeTags(photo) +
    "\n\nThis photo was downloaded from Facebook." +
    "\n\nLink: " +
    photo.link +
    "\n\nPhoto ID: " +
    photo.id;

  zeroth[piexif.ImageIFD.ImageDescription] = description;

  debug(
    "Adding description to photo: " + photo.id + " description: " + description
  );

  var MULTIPLIER = 1000000; // lat-long multiplier

  if (photo.place && photo.place.location) {
    debug("Adding GPS data to " + photo.id);

    // If value is negative then it is either west longitude or south latitude.
    // From: http://www.offroaders.com/info/tech-corner/reading/GPS-Coordinates.htm

    if (photo.place.location.latitude) {
      gps[piexif.GPSIFD.GPSLatitudeRef] =
        photo.place.location.latitude < 0 ? "S" : "N";
      gps[piexif.GPSIFD.GPSLatitude] = [
        Math.abs(Math.floor(photo.place.location.latitude * MULTIPLIER)),
        MULTIPLIER
      ];
    }

    if (photo.place.location.longitude) {
      gps[piexif.GPSIFD.GPSLongitudeRef] =
        photo.place.location.longitude < 0 ? "W" : "E";
      gps[piexif.GPSIFD.GPSLongitude] = [
        Math.abs(Math.floor(MULTIPLIER * photo.place.location.longitude)),
        MULTIPLIER
      ];
    }
  }

  var exifObj = { "0th": zeroth, Exif: exif, GPS: gps };

  var exifbytes = piexif.dump(exifObj);

  var newData = piexif.insert(exifbytes, file);

  return new Buffer(newData, "binary");
};
