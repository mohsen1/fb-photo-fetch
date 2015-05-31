var piexif = require("piexifjs");
var toExifDate = require('to-exif-date');

module.exports = function (photo, file) {
  var zeroth = {};
  var exif = {};
  var gps = {};


  var date = toExifDate(new Date(photo.created_time));

  exif[piexif.ExifIFD.DateTimeOriginal] = date;
  gps[piexif.GPSIFD.GPSDateStamp] = date;
  gps[piexif.GPSIFD.GPSTimeStamp] = date;


  zeroth[piexif.ImageIFD.Make] = "Facebook Photo";

  var LATLONG_MULTIPLIER = 1000000000000;

  if (photo.place && photo.place.location) {
    gps[piexif.GPSIFD.GPSLatitudeRef] = "N";

    gps[piexif.GPSIFD.GPSLatitude] = [
      Math.floor(photo.place.location.latitude * 1000000),
      1000000
    ];


    gps[piexif.GPSIFD.GPSLongitudeRef] = "W";

    gps[piexif.GPSIFD.GPSLongitude] = [
      Math.floor(-1 * 1000000 * photo.place.location.longitude),
      1000000
    ];
  }

  var exifObj = {"0th":zeroth, "Exif":exif, "GPS":gps};

  var exifbytes = piexif.dump(exifObj);


  var newData = piexif.insert(exifbytes, file);

  return new Buffer(newData, "binary");
};