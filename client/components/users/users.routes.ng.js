'use strict'

angular.module('fakeArtistApp')
.config(function($stateProvider) {
  $stateProvider
  .state('users', {
    url: '/users',
    templateUrl: 'client/components/users/users.view.ng.html',
    controller: 'UsersCtrl'
  })
  .state('newGame',{
  	url:'/newGame',
  	templateUrl: 'client/components/users/users.new.view.ng.html',
  	controller: 'UsersCtrl'
  });
});