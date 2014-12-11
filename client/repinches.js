Repinches = {};

Repinches.isMobile = function() {
  return (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i).test(navigator.userAgent);
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

