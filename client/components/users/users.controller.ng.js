'use strict'

angular.module('fakeArtistApp')
.controller('UsersCtrl', function($scope) {

  $scope.helpers({
    users: function() {
      return Users.find({});
    }
  });

  $scope.subscribe('users', function() {
    return [{}, $scope.getReactively('search')];
  });

  console.log($scope.users);
});