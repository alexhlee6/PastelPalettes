const setThemeColor = (tabId) => {
  chrome.storage.sync.get({
    themeColor: 'pink',
    useOriginalFont: false
  }, (items) => {
    chrome.tabs.insertCSS(tabId, {
      file: `css/${items.themeColor}.css`
    });
    if (items.useOriginalFont) {
      chrome.tabs.insertCSS(tabId, {
        file: `css/originalfont.css`
      });
    }
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