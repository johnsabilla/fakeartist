'use strict'

angular.module('fakeArtistApp')
.config(function($stateProvider) {
  $stateProvider
  .state('rooms', {
    url: '/rooms',
    templateUrl: 'client/components/room/room.view.ng.html',
    controller: 'RoomsCtrl'
  })
  .state('room', {
  	url: '/rooms/:roomId',
  	templateUrl: 'client/components/room/room.single.view.ng.html',
  	controller: 'RoomsCtrl'
  })
  .state('inplay', {
    url: '/inplay/:roomId',
    templateUrl: 'client/components/room/room.inplay.view.ng.html',
    controller: 'RoomsCtrl'
  })
});