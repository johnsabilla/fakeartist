'use strict'

angular.module('fakeArtistApp')
.controller('RoomsCtrl', function($scope, $stateParams, $location, $state, $mdDialog) {
  $scope.room = null;
  
  $scope.subscribe('rooms', function() {
    return [{}, $scope.getReactively('search')];
  });

  var userId = Session.get('userId');
  $scope.userId = userId;

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
    $scope.userId = newUserId;
    $scope.isNew = false;

    newUser.id = newUserId;
    var room = Rooms.find({ "name" : $stateParams.roomId }).fetch();
    //console.log(room[0]);
    Rooms.update({ "_id" : room[0]._id}, { $push : { 'players' : newUser}} );

  };

  $scope.return = function() {
    var start = {isStarted: false};
    var chosenWord = { chosendWord: "" };
    var room = Rooms.findOne({ "name": $stateParams.roomId });

    if(room && ($scope.roomCreator == userId)){
      Rooms.update({ "_id" : room._id}, {$unset: chosenWord });
      Rooms.update({ "_id" : room._id}, {$unset: start });


      for(var x = 0; x < room.players.length; x++){
        if(room.players[x].isFakeArtist === true) {
          var isFakeArtist = room.players[x];
          isFakeArtist.isFakeArtist = false;
          console.log(isFakeArtist);
          Rooms.update({ "_id" : room._id}, { $pull : { "players" : { "id" : isFakeArtist.id} } } );
          Rooms.update({ "_id" : room._id}, { $push : { "players" : isFakeArtist} } );
        }
      }
    }
    $location.path('/rooms/' + room.name);
  };

  $scope.proceed = function() {
    //pick fakeartist
    //show words
    //move to new
    var start = {isStarted: true};
    var userId = Session.get('userId');
    var room = Rooms.findOne({ "name": $stateParams.roomId });
    var words = Words.findOne({});

    if(room && ($scope.roomCreator == userId)) {
    
      var index = Math.floor((Math.random() * ( words.words.length )));
      var chosenWord = { "chosenWord" :words.words[index] };
    
      console.log(chosenWord);

      Rooms.update({ "_id" : room._id}, {$set: chosenWord });
      Rooms.update({ "_id" : room._id}, {$set: start });

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

  $scope.main = function(){
    var room = Rooms.findOne({ "name": $stateParams.roomId });
    var currentUserId = Session.get("userId");

    if(room){

      //If the user who created the room leaves,
      //The next player in the players list in the room
      //get promoted
      if(Session.get("userId") === $scope.roomCreator
        && room.players.length > 1){
        console.log('roomCreator left the room');
        var newRoomCreator = null;
        //because index 0 is the original Creator
        for(var x = 1; room.players.length; x++){
          newRoomCreator = room.players[x];
          $scope.roomCreator = newRoomCreator.id;
          break;
        }

        newRoomCreator.isCreator = true;
        Rooms.update({ "_id" : room._id}, { $pull : { "players" : { "id" : newRoomCreator.id} } } );
        Rooms.update({ "_id" : room._id}, { $push : { "players" : newRoomCreator} } );

      }
      Rooms.update({ "_id": room._id}, { $pull : { "players" : { "id": currentUserId } } } );
      Session.set("userId", null);
      Session.set("roomId", null);
    }

    $location.path('/');
  };


  $scope.delete = function(room){
    console.log('button is clicked' + room._id);
    Rooms.remove({ _id: room._id});
  };

  $scope.update = function(user){
    
    $mdDialog.show({
        locals: {user: user},
        clickOutsideToClose: true,
        scope: $scope,
        preserveScope: true,
        controller: function DialogController($scope, $mdDialog, user) {
         $scope.closeDialog = function() {
           $mdDialog.hide();
         };

         $scope.submitForm = function() {
            console.log(user);
            var updatedUser = user;
            delete updatedUser.$$hashKey;
            var room = Rooms.findOne({ "players.id" : updatedUser.id});

            if(room){
              Rooms.update({ "_id" : room._id}, { $pull : { "players" : { "id" : updatedUser.id} } } );
              Rooms.update({ "_id" : room._id}, { $push : { "players" : updatedUser} } );
            }
            $mdDialog.hide();
         };
         $scope.user = user;
        },
        template: '<md-dialog>' +
          '  <md-dialog-content>' +
          '    <form name="userName">' +
          '      <md-input-container>' +
          '        <label>Enter new name</label>' +
          '        <input type="text" name="userName" ng-model="user.name">' +
          '         <md-button ng-click="submitForm()">' +
          '           Save' +
          '         </md-button>' +
          '      </md-input-container>' +
          '    </form>' +
          '  </md-dialog-content>' +
          '</md-dialog>'
      });
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
      var userId = Session.get('userId');
      var user = Users.findOne({ "_id": userId});
      var currentUser = {};

      if(user) {
        var room = Rooms.findOne({ "name": $stateParams.roomId});

        if(room) {
          if(room.isStarted === undefined && ($location.path() === '/inplay/'+room.name)) {
            $state.go('room', { "roomId": room.name });

          }

          currentUser.chosenWord = room.chosenWord;
          for(var i = 0; i < room.players.length; i++){
            if(room.players[i].id == user._id) {
              currentUser.player = room.players[i];
              return currentUser;
            }
          }
        }
      }
    }
  });

});