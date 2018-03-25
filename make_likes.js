/*
 * Makes a string from user likes of a photo
*/
module.exports = function makeLikes(photo) {
  if (!photo || !photo.likes || !Array.isArray(photo.likes.data)) {
    return "";
  }

  return photo.likes.data
    .map(function(like) {
      return like.name;
    })
    .join(", ");
};
