'use strict'

angular.module('fakeArtistApp')
.controller('MainCtrl', function($scope, $location, $mdDialog) {

  $scope.helpers({
    things: function() {
      return Things.find({});
    }
  });
                  
  $scope.subscribe('things', function() {
    return [{}, $scope.getReactively('search')];
  });

  $scope.save = function() {
    if ($scope.form.$valid) {
      Things.insert($scope.newThing);
      $scope.newThing = undefined;
    }
  };
                  
  $scope.remove = function(thing) {
    Things.remove({_id: thing._id});
  };

  $scope.newGame = function(){
    $location.path('/rooms');
  };

  $scope.joinGame = function(){
    $location.path('/joinGame');
  };

  $scope.joinGame = function(env) {
    $mdDialog.show({
      clickOutsideToClose: true,
        scope: $scope,
        preserveScope: true,
        controller: function DialogController($scope, $mdDialog) {
         $scope.closeDialog = function() {
           $mdDialog.hide();
         };

         $scope.submitForm = function() {

            var room = Rooms.find({ "name" : $scope.user.roomName }).fetch();

            console.log('Found rooms: ' + room.length);
            console.log(room);
            console.log('Current number of users: ' + room[0].players.length);

            if(room.length < 1) {
              //room not found
            }
            else {
              if(room[0].players.length >= 10 ) {
                //room is full
              }
              else {
                Session.set('roomId', $scope.user.roomName);
                $location.path('/rooms/' + $scope.user.roomName);
              }
            }

         };
        },
        template: '<md-dialog>' +
          '  <md-dialog-content>' +
          '    <form name="userName">' +
          '      <md-input-container>' +
          '        <label>Enter room name</label>' +
          '        <input type="text" name="userName" ng-model="user.roomName">' +
          '         <md-button ng-click="submitForm()">' +
          '           Join Game' +
          '         </md-button>' +
          '      </md-input-container>' +
          '    </form>' +
          '  </md-dialog-content>' +
          '</md-dialog>'
      });
    };

  $scope.showDialog = function(env) {
    $mdDialog.show({
        clickOutsideToClose: true,
        scope: $scope,
        preserveScope: true,
        controller: function DialogController($scope, $mdDialog) {
         $scope.closeDialog = function() {
           $mdDialog.hide();
         };

         $scope.submitForm = function() {
            var newUserId = Users.insert($scope.user);
            var roomName = generateRandomString();
            var room = { 
              name: roomName,
              players: [{ "name": $scope.user.name, "id": newUserId, 'isCreator': true }]
            };
            Session.set('userId', newUserId);
            Rooms.insert(room);
            $location.path('/rooms/' + roomName);


         };
        },
        template: '<md-dialog>' +
          '  <md-dialog-content>' +
          '    <form name="userName">' +
          '      <md-input-container>' +
          '        <label>Enter your name</label>' +
          '        <input type="text" name="userName" ng-model="user.name">' +
          '         <md-button ng-click="submitForm()">' +
          '           Create Game' +
          '         </md-button>' +
          '      </md-input-container>' +
          '    </form>' +
          '  </md-dialog-content>' +
          '</md-dialog>'
    });
  };
});

function generateRandomString()
{
  var len = 7;
  var text = "";
  var charset = "abcdefghijklmnopqrstuvwxyz";

    for( var i=0; i < len; i++ )
    {
      text += charset.charAt(Math.floor(Math.random() * charset.length));
    }

    return text;
}



