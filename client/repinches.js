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

Template.player.current = function() {
  return Songs.findOne()
};

Template.player.currentId = function() {
  var song = Songs.findOne();
  return song && song.id;
};

Template.player.init = function() {
  if (Template.player.ytplayer) {
    Template.player.ytplayer.loadVideoById(Template.player.current().id);
  } else {
    var params = { allowScriptAccess: "always" };
    var atts = { id: "ytplayer" };
    var width = "1140";

    swfobject.embedSWF("http://www.youtube.com/v/" + Template.player.current().id + "?enablejsapi=1&playerapiid=ytplayer&version=3&autoplay=1",
                       "ytapiplayer", width, "356", "8", null, null, params, atts)
  }
};

Template.player.next = function() {
  Songs.remove(this.current()._id);

  if (this.current()) {
    this.ytplayer.loadVideoById(this.current().id);
  }
};

Template.player.ended = function(newState) {
  if (newState === 0) {
    this.next();
  };
};

Template.playlist.songs = function() {
  return Songs.find({}, { skip: 1 });
};

this.onYouTubePlayerReady = function(playerId) {
  Template.player.ytplayer = document.getElementById("ytplayer");
  Template.player.ytplayer.addEventListener("onStateChange", "Template.player.ended");
};

Template.add.events({
  'click input' : function(event) {
    jQuery('#search_query').focus();
  }
});
