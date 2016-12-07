Meteor.startup(function() {
  if(Users.find().count() === 0) {
    var users = [
      {
        'name': 'user 1'
      },
      {
        'name': 'user 2'
      }
    ];
    users.forEach(function(user) {
      Users.insert(user);
    });
  }
});