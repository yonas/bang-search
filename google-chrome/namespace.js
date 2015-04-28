/*
 * This file is part of !Bang Search <https://github.com/yonas/bang-search>,
 * Copyright (C) 2015 Yonas Yanfa
 *
 * !Bang Search is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License version 3 as
 * published by the Free Software Foundation.
 *
 * !Bang Search is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with !Bang Search.  If not, see <http://www.gnu.org/licenses/>.
 */

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
