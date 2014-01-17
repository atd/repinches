Repinches = {};

Repinches.isMobile = function() {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
};

Template.search.delay = 1000;

Template.search.songs = function() {
  return Session.get("searchSongs");
}

Template.search.apiCall = function(q) {
  var request = gapi.client.youtube.search.list({ q: q,
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

    jQuery('#search-progress').hide();
    Session.set("searchSongs", newSongs);
  });
}

Template.search.events({
  'keypress input' : function (event) {
    jQuery('#search-progress').show();

    if (Template.search.timer) {
      window.clearTimeout(Template.search.timer);
    }

    Template.search.timer = window.setTimeout(function() {
      Template.search.timer = null;
      Template.search.apiCall(event.target.value);
    }, Template.search.delay);
  }
});

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
    Session.set("searchSongs", []);
  }
});

Template.player.isMobile = function() {
  return Repinches.isMobile();
};

Template.player.current = function() {
  return QueuedSongs.findOne();
};

Template.player.currentSong = function() {
  if (Template.player.current()) {
    return Songs.findOne({ id: Template.player.current().song_id });
  } else {
    return null;
  }
};

Template.player.init = function() {
  if (Template.player.ytplayer) {
    Template.player.ytplayer.loadVideoById(Template.player.currentSong().id);
  } else {
    var params = { allowScriptAccess: "always" };
    var atts = { id: "ytplayer" };
    var width = "1140";

    swfobject.embedSWF("http://www.youtube.com/v/" + Template.player.currentSong().id + "?enablejsapi=1&playerapiid=ytplayer&version=3&autoplay=1",
                       "ytapiplayer", width, "356", "8", null, null, params, atts)
  }
};

Template.player.next = function() {
  QueuedSongs.remove(this.current()._id);

  if (this.current()) {
    this.ytplayer.loadVideoById(this.currentSong().id);
  }
};

Template.player.ended = function(newState) {
  if (newState === 0) {
    this.next();
  };
};

Template.playlist.queued_songs = function() {
  return QueuedSongs.find({}, { skip: 1 })
};

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

this.onYouTubePlayerReady = function(playerId) {
  Template.player.ytplayer = document.getElementById("ytplayer");
  Template.player.ytplayer.addEventListener("onStateChange", "Template.player.ended");
};

Template.add.events({
  'click input' : function(event) {
    jQuery('#search_query').focus();
  }
});

