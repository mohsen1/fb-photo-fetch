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

  if (photo.place && photo.place.location) {
    gps[piexif.GPSIFD.GPSLatitude] = photo.place.location.latitude;
    gps[piexif.GPSIFD.GPSLongitude] = photo.place.location.longitude;
  }

  var exifObj = {"0th":zeroth, "Exif":exif, "GPS":gps};
  var exifbytes = piexif.dump(exifObj);


  var newData = piexif.insert(exifbytes, file);

  return new Buffer(newData, "binary");
};