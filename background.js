// 


var browserListener = function (tabId, changeInfo, tab) {
  var regexPage = new RegExp(/https:\/\/twitter.com\//);
  var match = regexPage.exec(tab.url);
  if (match && tab.status === 'complete') {
    chrome.tabs.insertCSS(tab.id, {
      file: "css/pink.css"
    });
  }
}
chrome.tabs.onUpdated.addListener(browserListener);