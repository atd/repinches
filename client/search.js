Template.search.delay = 1000;

Template.search.helpers({
  songs: function() { return Session.get("searchSongs"); }
});

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
        };
      });

    jQuery('#search-progress').hide();
    Session.set("searchSongs", newSongs);
  });
};

Template.search.events({
  'keypress input' : function (event) {
    jQuery('#search-results').show();
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
