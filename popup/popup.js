const handleSaveButtonActivated = () => {
  var saveButton = document.getElementById('save');
  saveButton.disabled = true;
  saveButton.textContent = 'Saved!';
}

const handleSaveComplete = () => {
  var saveButton = document.getElementById('save');
  saveButton.textContent = 'Save';
  saveButton.disabled = false;
}

const save_options = async () => {
  // Show theme selection was saved on the popup
  handleSaveButtonActivated();

  // Get the value of selected color
  const color = document.getElementById('themeColor').value;
  // Save the theme color to memory
  await chrome.storage.sync.set({
    themeColor: color
  });

  // Retrieve theme values from memory
  const items = await chrome.storage.sync.get({
    themeColor: 'pink',
    useOriginalFont: false
  });

  // Unregister all content scripts (css files)
  await chrome.scripting.unregisterContentScripts();
  // Register content scripts for the current theme color
  if (items.themeColor !== "none") {
    await chrome.scripting.registerContentScripts([
      { id: "main", matches: ['https://twitter.com/*', 'https://x.com/*'], css: ['css/main.css'], runAt: "document_start" },
      { id: "theme-color", matches: ['https://twitter.com/*', 'https://x.com/*'], css: [`css/colors/${items.themeColor}.css`], runAt: "document_start" }
    ]);
  }
  
  const activeTabsTwitter = await chrome.tabs.query({ status: 'complete', active: true, url: "https://twitter.com/*" }); 
  const activeTabsX = await chrome.tabs.query({ status: 'complete', active: true, url: "https://x.com/*" }); 
  for (const tab of [...activeTabsTwitter, ...activeTabsX]) {
    await chrome.tabs.update(tab.id, { url: tab.url });
  };

  const inactiveTabsTwitter = await chrome.tabs.query({ status: 'complete', active: false, discarded: false, url: "https://twitter.com/*" });
  const inactiveTabsX = await chrome.tabs.query({ status: 'complete', active: false, discarded: false, url: "https://x.com/*" });
  
  for (const tab of [...inactiveTabsTwitter, ...inactiveTabsX]) {
    await chrome.tabs.discard(tab.id)
  };

  setTimeout(handleSaveComplete, 1200);
}

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
function restore_options() {
  // Use default value color = 'red'
  chrome.storage.sync.get({
    themeColor: 'pink',
    useOriginalFont: false
  }, function (items) {
    document.getElementById('themeColor').value = items.themeColor;
    // document.getElementById('useOriginalFont').value = (items.useOriginalFont ? "originalfont" : "");
  });
}
document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click',
  save_options);
