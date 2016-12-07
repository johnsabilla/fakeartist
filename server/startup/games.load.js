Meteor.startup(function() {
  if(Games.find().count() === 0) {
    var games = [
      {
        'name': 'game 1'
      },
      {
        'name': 'game 2'
      }
    ];
    games.forEach(function(game) {
      Games.insert(game);
    });
  }
});