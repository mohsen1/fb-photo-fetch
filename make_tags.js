/*
 * Make tags from a photo
*/

module.exports = function makeTags(photo) {
  if (!photo || !photo.name_tags) {
    return "";
  }

  var str = "";

  for (var tagId in photo.name_tags) {
    var tag = photo.name_tags[tagId];

    if (Array.isArray(tag)) {
      str += tag[0].name + "\n";
    }
  }
};
