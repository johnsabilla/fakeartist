'use strict'

angular.module('fakeArtistApp')
.config(function($stateProvider) {
  $stateProvider
  .state('games', {
    url: '/games',
    templateUrl: 'client/components/games/games.view.ng.html',
    controller: 'GamesCtrl'
  });
});