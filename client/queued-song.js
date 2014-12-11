Template.queued_song.song = function() {
  return Songs.findOne({ id: this.song_id });
};

Template.queued_song.title = function() {
  //TODO
  return Songs.findOne({ id: this.song_id }).title;
};

Template.queued_song.description = function() {
  //TODO
  return Songs.findOne({ id: this.song_id }).description;
};

Template.queued_song.thumbnail = function() {
  //TODO
  return Songs.findOne({ id: this.song_id }).thumbnail;
};

Template.queued_song.isOwner = function() {
  return this.session_id === Meteor.default_connection._lastSessionId;
};

Template.queued_song.events({
  'click input' : function(event) {
    if (confirm("¿Borrar canción de la lista?")) {
      QueuedSongs.remove(this._id);
    }
  }
});
