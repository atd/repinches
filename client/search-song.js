Template.searchSong.events({
  'click' : function() {
    var song = Songs.findOne({ id: this.id });

    if (!song) {
      Songs.insert({
        id: this.id,
        title: this.title,
        description: this.description,
        thumbnail: this.thumbnail
      });
    }
    
    QueuedSongs.insert({
      song_id: this.id,
      session_id: Meteor.default_connection._lastSessionId
    });

    $('#search_query').val('');
    $('#search-results').slideUp();
    Session.set("searchSongs", []);
  }
});
