const OLD_FILES_TO_REMOVE = [
  "css/main.css",
  "css/colors/lavender.css",
  "css/colors/lime.css",
  "css/colors/none.css",
  "css/colors/pink.css",
  "css/colors/seafoam.css",
  "css/colors/skyblue.css",
  "css/colors/tangerine.css"
];


const setThemeColorInitial = async () => {
  const items = await chrome.storage.sync.get({
    themeColor: 'pink',
    useOriginalFont: false
  }).catch(e => console.log(e));

  if (items.themeColor === "none") {
    await chrome.scripting.unregisterContentScripts();
  } else {
    await chrome.scripting.unregisterContentScripts();
    await chrome.scripting.registerContentScripts([
      { id: "main", matches: ['https://twitter.com/*', 'https://x.com/*'], css: ['css/main.css'], runAt: "document_start" },
      { id: "theme-color", matches: ['https://twitter.com/*', 'https://x.com/*'], css: [`css/colors/${items.themeColor}.css`], runAt: "document_start" }
    ]).catch(e => console.log(e));
  }
}


const doSetup = async () => {
  const twtTabs = await chrome.tabs.query({ status: 'complete', discarded: false, url: "https://twitter.com/*" }).catch(e => console.log(e));
  const xTabs = await chrome.tabs.query({ status: 'complete', discarded: false, url: "https://x.com/*" }).catch(e => console.log(e));
  const allTwtTabs = [...twtTabs, ...xTabs]
  for (let i = 0; i < allTwtTabs.length; i++) {
    const tab = allTwtTabs[i];
    await chrome.scripting.removeCSS({
      files: OLD_FILES_TO_REMOVE,
      target: { tabId: tab.id }
    }).catch(e => console.log(e));
  }

  await setThemeColorInitial();
  allTwtTabs.forEach(tab => {
    if (tab.active) {
      chrome.tabs.update(tab.id, { url: tab.url }).catch(e => console.log(e));
    } else {
      chrome.tabs.discard(tab.id).catch(e => console.log(e));
    }
  });
}

doSetup();