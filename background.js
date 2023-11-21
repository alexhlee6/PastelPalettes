const insertCSSCallback = async (tabId, items) => {
  if (items.themeColor === "none") {
    await chrome.scripting.removeCSS({
      files: ["css/main.css"],
      target: { tabId }
    });
  } else {
    await chrome.scripting.insertCSS({
      files: ["css/main.css", `css/colors/${items.themeColor}.css`],
      target: { tabId }
    });
  }
}

const setThemeColor = async (tabId) => {
  chrome.storage.sync.get({
    themeColor: 'pink',
    useOriginalFont: false
  }, (items) => {
    insertCSSCallback(tabId, items)
  });
}

var browserListener = function (tabId, changeInfo, tab) {
  var regexPage = new RegExp(/https:\/\/twitter.com\//);
  var match = regexPage.exec(tab.url);
  if (match && tab.status === 'complete') {
    setThemeColor(tab.id);
  }
}
chrome.tabs.onUpdated.addListener(browserListener);