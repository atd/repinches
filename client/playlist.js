Template.playlist.helpers({
  queued_songs: function() { return QueuedSongs.find({}, { skip: 1 }); }
});

