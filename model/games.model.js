Games = new Mongo.Collection('games');

Games.allow({
  insert: function(userId, game) {
    return true;
  },
  update: function(userId, game, fields, modifier) {
    return true;
  },
  remove: function(userId, game) {
    return true;
  }
});