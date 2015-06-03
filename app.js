'use strict';

const userHome = require('user-home');
const fs = require('fs');
const path = require('path');
const ipc = require('ipc');
const execute = require('./execute');
const remote = require('remote');
const Menu = remote.require('menu');
const MenuItem = remote.require('menu-item');
const clipboard = require('clipboard');

const menu = new Menu();

const downloadFolderName = 'Facebook Photos';

angular
  .module('FBPhotoFetch', ['ngMaterial'])
  .controller('AppCtrl', AppCtrl);

function AppCtrl($scope, $interval) {
  $scope.tagged = true;
  $scope.token = '';
  var token = null;
  $scope.tab = 0;
  $scope.downloading = false;
  $scope.bufferProgress = 0;
  $scope.progress = 0;

  if (fs.existsSync(path.join(userHome, 'Pictures'))) {
    $scope.dest = path.join(userHome, 'Pictures', downloadFolderName);
  } else {
    $scope.dest = path.join(userHome, downloadFolderName);
  }

  $scope.openFB = function() {
    ipc.sendSync('open-fb');
  };

  $scope.next = function(token_) {
    if (token_) { token = token_; }
    $scope.tab++;
  };

  $scope.prev = function() {
    $scope.tab--;
  };

  $scope.download = function() {

    execute(token, $scope.tagged, $scope.dest, finish, progress);

    $scope.downloading = true;

    $interval(function () {
      $scope.bufferProgress += 1;
    }, 1000);

    function progress (percent) {
      $scope.progress = percent;
    }

    function finish(err) {
      if (!err) {
        alert('Downloaded all your photos');
      } else {
        alert('There was an error downloading your photos.');
      }
      $scope.downloading = false;
    }
  };


  $scope.paste =  paste;

  function paste() {
    $scope.token = clipboard.readText();
  };


  menu.append(new MenuItem({ label: 'Paste', click: paste }));

  window.addEventListener('contextmenu', function (e) {
    e.preventDefault();
    menu.popup(remote.getCurrentWindow());
  }, false);


  $scope.$watch('selectedFile', function () {
    if ($scope.selectedFile) {
      $scope.dest = $scope.selectedFile[0].path;
    }
  })
}

