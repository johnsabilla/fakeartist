Meteor.startup(function() {
  if(Rooms.find().count() === 0) {
    var rooms = [
      {
        'name': 'room 1'
      },
      {
        'name': 'room 2'
      }
    ];
    rooms.forEach(function(room) {
      Rooms.insert(room);
    });
  }
});