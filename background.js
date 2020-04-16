const setThemeColor = (tabId) => {
  chrome.storage.sync.get({
    themeColor: 'pink',
  }, (items) => {
    chrome.tabs.insertCSS(tabId, {
      file: `css/${items.themeColor}.css`
    });
  })
}

var browserListener = function (tabId, changeInfo, tab) {
  var regexPage = new RegExp(/https:\/\/twitter.com\//);
  var match = regexPage.exec(tab.url);
  if (match && tab.status === 'complete') {
    setThemeColor(tab.id);
  }
}
chrome.tabs.onUpdated.addListener(browserListener);