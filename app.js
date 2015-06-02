const userHome = require('user-home');
const fs = require('fs');
const path = require('path');

const downloadFolderName = 'Facebook Photos';

angular
  .module('FBPhotoFetch', ['ngMaterial'])
  .controller('AppCtrl', AppCtrl);

function AppCtrl($scope) {
  $scope.tagged = true;
  $scope.token = null;

  if (fs.existsSync(path.join(userHome, 'Pictures'))) {
    $scope.dest = path.join(userHome, 'Pictures', downloadFolderName);
  } else {
    $scope.dest = path.join(userHome, downloadFolderName);
  }
}

// var throttle = require('lodash.throttle');

// var execute = require('./execute');

// document.querySelector('#download').addEventListener('click', function () {
//   var token = document.querySelector('#token').value;
//   var dest = document.querySelector('#dest').files[0].path;
//   var tagged = document.querySelector('#tagged').checked;

//   execute(token, tagged, dest, finish, throttle(progress, 100));

//   function progress (percent) {
//     document.querySelector('progress').value = percent;
//   }

//   function finish(err) {
//     if (!err) {
//       alert('Downloaded all your photos');
//     } else {
//       alert('There was an error downloading your photos.');
//     }
//   }
// });