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
  'keyup input' : function (event) {

    if (Template.search.timer) {
      window.clearTimeout(Template.search.timer);
    }

    if (event.target.value === '') {
      $('#search-progress').hide();
      $('#search-results').slideUp();
      Session.set("searchSongs", []);
    } else {
      $('#search-progress').show();
      $('#search-results').slideDown();

      Template.search.timer = window.setTimeout(function() {
        Template.search.timer = null;
        Template.search.apiCall(event.target.value);
      }, Template.search.delay);
    }
  }
});
