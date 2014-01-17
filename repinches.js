Songs = new Meteor.Collection("songs");
QueuedSongs = new Meteor.Collection("queued_songs");

if (Meteor.isClient) {
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
