/*
 * Makes description string from photo information
*/
module.exports = function makeDescription(photo) {
  if (!photo || !photo.comments || !Array.isArray(photo.comments.data)) {
    return "";
  }

  return photo.comments.data
    .map(function(comment) {
      return comment.from.name + ":\n" + comment.message;
    })
    .join("\n\n");
};
