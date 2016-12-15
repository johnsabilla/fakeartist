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
            var roomName = ($scope.user.roomName).toLowerCase();
            var room = Rooms.find({ "name" : roomName }).fetch();

            if(room.length > 0){
              if(room[0].players.length >= 10 ) {
                //room is full
              }
              else {
                Session.set('roomId', roomName);
                $location.path('/rooms/' + roomName);
              }
            }
            else{
              //Access code does not exist.
              var error = {};
              error.message = "Denied.";
              $scope.error = error;
            }

         };
        },
        template: '<md-dialog>' +
          '  <md-dialog-content>' +
          '    <form name="userName">' +
          '      <md-input-container>' +
          '        <label>Access code </label>' +
          '        <input type="text" name="userName" ng-model="user.roomName">' +
          '     <div style="color:red;"> {{ error.message}} </div>' +
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

            if(room){
              Session.set('userId', newUserId);
              Rooms.insert(room);
              $location.path('/rooms/' + roomName);
            }
            else{

            }

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



