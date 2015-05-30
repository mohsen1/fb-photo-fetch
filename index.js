var fs = require('fs');
var getAll = require('./get_all');

var argv = require('minimist')(process.argv.slice(2));
var token = argv.token;

if (!token) {
  throw new Error('Please provide the token');
}

getAll(token, argv.tagged, function (err, result) {

  if (err) {throw err; }

  fs.writeFileSync('result.json', JSON.stringify(result, null, 4));
});