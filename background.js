const insertCSSCallback = async (tabId, items) => {
  const insertPromise = await chrome.scripting.insertCSS({
    files: ["css/main.css", `css/colors/${items.themeColor}.css`],
    target: { tabId }
  });
  if (items.useOriginalFont) {
    await chrome.scripting.insertCSS({
      files: [`css/originalfont.css`],
      target: { tabId }
    });
  }
  return insertPromise;
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