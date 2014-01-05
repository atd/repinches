Songs = new Meteor.Collection("songs");

if (Meteor.isClient) {
  Template.search.songs = function() {
    return Session.get("searchSongs");
  }

  Template.search.events({
    'keypress input' : function () {
      var request = gapi.client.youtube.search.list({ q: event.target.value,
                                                      type: 'video',
                                                      part: 'snippet'});
      request.execute(function(response) {
        var newSongs = 
          jQuery.map(response.items, function(e) {
            return {
              id: e.id.videoId,
              title: e.snippet.title,
              description: e.snippet.description,
              thumbnail: e.snippet.thumbnails.default.url
            }
          });

        Session.set("searchSongs", newSongs);
      });
    }
  });

  Template.searchSong.events({
    'click' : function() {
      Songs.insert({
        id: this.id,
        title: this.title,
        description: this.description,
        thumbnail: this.thumbnail
      });

      $('#search_query').val('');
      Session.set("searchSongs", []);
    }
  });

  Template.playlist.songs = function() {
    return Songs.find();
  };
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
