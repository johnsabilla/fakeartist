'use strict'

angular.module('fakeArtistApp')
.controller('RoomsCtrl', function($scope, $stateParams, $location, $state) {
  $scope.room = null;
  
  $scope.subscribe('rooms', function() {
    return [{}, $scope.getReactively('search')];
  });

  var userId = Session.get('userId');

  if(userId == null ) {
    $scope.isNew = true;
  }

  $scope.submit = function(username) {
    var newUser = {
        name : username
    };
    var newUserId = Users.insert(newUser);
    //console.log('user' + newUserId);

    Session.set('userId', newUserId);
    $scope.isNew = false;

    newUser.id = newUserId;
    var room = Rooms.find({ "name" : $stateParams.roomId }).fetch();
    //console.log(room[0]);
    Rooms.update({ "_id" : room[0]._id}, { $push : { 'players' : newUser}} );

  };

  $scope.proceed = function() {
    //pick fakeartist
    //show words
    //move to new
    var start = {isStarted: true};
    var userId = Session.get('userId');
    var room = Rooms.findOne({ "name": $stateParams.roomId });

    if(room && ($scope.roomCreator == userId)) {
      Rooms.update({ "_id" : room._id}, {$set: start});

      var index = Math.floor((Math.random() * ( room.players.length )));

      var pickedPlayer = room.players[index];

      pickedPlayer.isFakeArtist = true;
      console.log(pickedPlayer);

      //minimongo is gay, i have to break the update query into two to prevent
      //untrusted operation bullshit
      Rooms.update({ "_id" : room._id}, { $pull : { "players" : { "id" : pickedPlayer.id} } } );
      Rooms.update({ "_id" : room._id}, { $push : { "players" : pickedPlayer} } );

     
    }
    console.log('getting called');
    $location.path('/inplay/' + room.name);
  };

  $scope.helpers({
    rooms: function() {
      return Rooms.find({});
    },
    single: function(){
      var roomCreator = null;
      var room = Rooms.findOne({ "name": $stateParams.roomId });
      var userId = Session.get('userId');
      //Only the creator of the room can click start game.
      if(room) {
        if(room.isStarted === true && ($location.path() !== '/inplay/'+room.name)) {
          $state.go('inplay', { "roomId": room.name });
        }

        for(var x = 0; x < room.players.length; x++) {
          if(room.players[x].isCreator === true){
            roomCreator = room.players[x].id;
            $scope.roomCreator = roomCreator;
        }
      }

      console.log('roomCreator' + roomCreator);
      console.log('currentUser' + userId);
      console.log(room.players.length);

      /**
       * Only make the game 'startable' if the number of players is 
       * atleast 3 and no more than 10 and also only the roomCreator 
       * can start  the game.
       */
      if(room.players.length <= 10 && room.players.length >= 3 &&
          userId === roomCreator) {
          $scope.playersReady = true;
        }
      
      }
      return Rooms.find({ "name": $stateParams.roomId }).fetch();
    },
    inplay: function() {
      console.log('loaded inplay: ' + $stateParams.roomId);
      var userId = Session.get('userId');
      var user = Users.findOne({ "_id": userId});
      var currentUser = null;

      if(user) {
        var room = Rooms.findOne({ "name": $stateParams.roomId});

        if(room) {
          console.log(room);

          for(var i = 0; i < room.players.length; i++){
            if(room.players[i].id == user._id) {
              currentUser = room.players[i];
              return currentUser;
            }
          }
        }
      }
    }
  });

});