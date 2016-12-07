'use strict'

angular.module('fakeArtistApp')
.controller('GamesCtrl', function($scope) {

  $scope.helpers({
    games: function() {
      return Games.find({});
    }
  });

  $scope.subscribe('games', function() {
    return [{}, $scope.getReactively('search')];
  });


});