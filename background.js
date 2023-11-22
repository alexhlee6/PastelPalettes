const insertCSSCallback = async (items) => {
  if (items.themeColor === "none") {
    await chrome.scripting.unregisterContentScripts();
  } else {
    await chrome.scripting.unregisterContentScripts();
    await chrome.scripting.registerContentScripts([
      { id: "main", matches: ['https://twitter.com/*'], css: ['css/main.css'], runAt: "document_start" },
      { id: "theme-color", matches: ['https://twitter.com/*'], css: [`css/colors/${items.themeColor}.css`], runAt: "document_start" }
    ]);
  }
}

const setThemeColor = async (tabId) => {
  chrome.storage.sync.get({
    themeColor: 'pink',
    useOriginalFont: false
  }, insertCSSCallback);
}

var browserListener = function (tabId, changeInfo, tab) {
  var regexPage = new RegExp(/https:\/\/twitter.com\//);
  var match = regexPage.exec(tab.url);
  if (match && tab.status === 'complete') {
    // setThemeColor(tab.id);
  }
}

chrome.tabs.onUpdated.addListener(browserListener);
setThemeColor();