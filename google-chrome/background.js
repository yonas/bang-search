
chrome.tabs.onCreated.addListener(function(tab) {
    bangSearch.updateBangRules();
});
