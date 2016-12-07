angular.module('fakeArtistApp', [
  'angular-meteor',
  'ui.router',
  'ngMaterial'
 //'ngMdIcons'
]);

onReady = function() {
  angular.bootstrap(document, ['fakeArtistApp']);
};
  
if(Meteor.isCordova) {
  angular.element(document).on('deviceready', onReady);
} else {
  angular.element(document).ready(onReady);
}