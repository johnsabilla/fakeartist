Meteor.startup(function() {
  if(Words.find().count() === 0) {
    var words = {
       "words" : [
        "Tandem stock trends",
        "Urinal Cake",
        "Crippling debt",
        "Donald Trump's hands",
        "MechaHitler",
        "Harry Potter, post Hogwarts",
        "Best Korea (North)",
        "Duck face",
        "A dank meme",
        "Nickelback",
        "Dirty hipster",
        "Sexy Sax Man",
        "Hillary Clinton",
        "The dark web",
        "Oakland Raiders fan",
        "Bag of magic beans",
        "That one very annoying Star Wars character",
        "Keanu Reeves",
        "Flightless bird",
        "Millenial",
        "BATMAN",
        "Hot Pockets",
        "Weeaboo",
        "Justin Bieber"
      ]
    };
    Words.insert(words);
  }
});