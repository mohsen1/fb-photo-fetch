var request = require("request");
var debug = require("debug")("api");

// walks the paginated responses to it's end an callbacks with all the results
module.exports = function(url, cb) {
  var all = [];

  getURL(url);

  debug("getting " + url);

  function getURL(url) {
    request.get(url, function(err, res) {
      if (err) {
        return cb(err);
      }

      var result;
      try {
        result = JSON.parse(res.body);
      } catch (jsonError) {
        cb("Error while parsing payload. URL: " + url + " payload: ", res);
      }

      if (!result || !Array.isArray(result.data)) {
        cb(
          new Error(
            "Bad response while getting " + url + " payload: " + res.body
          )
        );
      }

      all = all.concat(result.data);

      if (result.paging && typeof result.paging.next === "string") {
        getURL(result.paging.next);
      } else {
        cb(null, all);
      }
    });
  }
};
