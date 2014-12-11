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
                       "ytapiplayer", width, "356", "8", null, null, params, atts);
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
  }
};

Template.player.helpers({
  current: Template.player.current
});


