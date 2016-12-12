Rooms = new Mongo.Collection('rooms');

Rooms.allow({
  insert: function(userId, room) {
    return true;
  },
  update: function(userId, room, fields, modifier) {
    return true;
  },
  remove: function(userId, room) {
    return true;
  }
});

Meteor.methods({
	deleteRoom: function(id){
		Rooms.remove(id);
	}
});