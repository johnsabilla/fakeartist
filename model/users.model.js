Users = new Mongo.Collection('users');

Users.allow({
  insert: function(userId, user) {
    return true;
  },
  update: function(userId, user, fields, modifier) {
    return true;
  },
  remove: function(userId, user) {
    return true;
  }
});