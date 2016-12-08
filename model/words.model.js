Words = new Mongo.Collection('words');

Words.allow({
  insert: function(userId, word) {
    return true;
  },
  update: function(userId, word, fields, modifier) {
    return true;
  },
  remove: function(userId, word) {
    return true;
  }
});