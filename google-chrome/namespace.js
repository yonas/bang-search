var bangSearch = {};

bangSearch.updateBangRules = function() {
  chrome.storage.sync.get('bangsearch.settings.bangs', function(items) {
    if (items['bangsearch.settings.bangs'] === undefined) {
        return;
    }

    var bangs = [];
    $.each(items['bangsearch.settings.bangs'], function(i, v) {
        bangs.push(v.bang);
    });

    chrome.declarativeWebRequest.onRequest.removeRules(bangs, function() {
      $.each(items['bangsearch.settings.bangs'], function(i, v) {
          var wr = chrome.declarativeWebRequest;
          wr.onRequest.addRules([{
            id: v.bang,
            conditions: [new wr.RequestMatcher({url: {hostSuffix: "duckduckgo.com", queryPrefix: "q=" + v.bang}})],
            actions: [new wr.RedirectByRegEx({from: "^.*duckduckgo.com/[?]q=" + v.bang + "([+]|%20)+(.+)$", to: v.url + "/$2"})]
          }]);
        });
      });
   });
}
