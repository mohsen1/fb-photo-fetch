var piexif = require("piexifjs");
var toExifDate = require('to-exif-date');
var makeDescription = require('./make_description');
var makeLikes = require('./make_likes');
var makeTags = require('./make_tags');

module.exports = function (photo, file) {
  var zeroth = {};
  var exif = {};
  var gps = {};


  var date = toExifDate(new Date(photo.created_time));

  exif[piexif.ExifIFD.DateTimeOriginal] = date;
  gps[piexif.GPSIFD.GPSDateStamp] = date;
  gps[piexif.GPSIFD.GPSTimeStamp] = date;


  zeroth[piexif.ImageIFD.Make] = "Facebook Photo";


  zeroth[piexif.ImageIFD.ImageDescription] = (photo.name || '') +
    makeLikes(photo) +
    ' liked this photo on Facebook\n' +
    'Facebook comments\n\n' + makeDescription(photo);
    '\nIn this photo: ' + makeTags(photo) +
    '\nThis photo was downloaded from Facebook.' +
    '\nLink: ' + photo.link +
    '\nPhoto ID: ' + photo.id


  var MULTIPLIER = 1000000; // lat-long multiplier

  if (photo.place && photo.place.location) {

    // If value is negative then it is either west longitude or south latitude.
    // From: http://www.offroaders.com/info/tech-corner/reading/GPS-Coordinates.htm
    gps[piexif.GPSIFD.GPSLatitudeRef] = photo.place.location.latitude < 0 ? "S" : "N";
    gps[piexif.GPSIFD.GPSLongitudeRef] = photo.place.location.longitude < 0 ? "W" : "E";

    gps[piexif.GPSIFD.GPSLatitude] = [
      Math.abs(Math.floor(photo.place.location.latitude * MULTIPLIER)),
      MULTIPLIER
    ];

    gps[piexif.GPSIFD.GPSLongitude] = [
      Math.abs(Math.floor(MULTIPLIER * photo.place.location.longitude)),
      MULTIPLIER
    ];
  }

  var exifObj = {"0th":zeroth, "Exif":exif, "GPS":gps};

  var exifbytes = piexif.dump(exifObj);


  var newData = piexif.insert(exifbytes, file);

  return new Buffer(newData, "binary");
};