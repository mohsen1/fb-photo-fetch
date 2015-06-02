var fs = require('fs');
var path = require('path');

var argv = require('minimist')(process.argv.slice(2));
var dest = argv.dest || path.join(__dirname, 'photos');
var token = argv.token;

if (!token) {
  throw new Error('Please provide the token');
}

process.env.DEBUG = argv.debug || process.env.DEBUG;

var execute = require('./execute');

console.log('Gathering your photos information...');

execute(token, argv.tagged, dest, function finished(err) {
  console.log(err ? 'Done with errors' : 'Done!');
}, function progress(percent) {
  console.log('Downloading photos: %d%', ~~percent);
});
