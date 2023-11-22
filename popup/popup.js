const handleSaveButtonActivated = () => {
  var saveButton = document.getElementById('save');
  saveButton.disabled = true;
  saveButton.textContent = 'Saved!';
  setTimeout(function () {
    saveButton.textContent = 'Save';
    saveButton.disabled = false;
  }, 750);
}

const save_options = async () => {
  // Get the value of selected color
  const color = document.getElementById('themeColor').value;
  // Save the theme color to memory
  await chrome.storage.sync.set({
    themeColor: color
  });

  // Show theme selection was saved on the popup
  handleSaveButtonActivated();

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
      { id: "main", matches: ['https://twitter.com/*'], css: ['css/main.css'], runAt: "document_start" },
      { id: "theme-color", matches: ['https://twitter.com/*'], css: [`css/colors/${items.themeColor}.css`], runAt: "document_start" }
    ]);
  }
  
  chrome.tabs.query({ status: 'complete', active: true }, (tabs) => {
    tabs.forEach((tab) => {
      let regexPage = new RegExp(/https:\/\/twitter.com\//);
      let match = regexPage.exec(tab.url);
      if (match) {
        chrome.tabs.update(tab.id, { url: tab.url });
      }
    });
  });
  chrome.tabs.query({ status: 'complete', active: false }, (tabs) => {
    tabs.forEach((tab) => {
      let regexPage = new RegExp(/https:\/\/twitter.com\//);
      let match = regexPage.exec(tab.url);
      if (match) {
        chrome.tabs.discard(tab.id).catch(e => console.log(e));
      }
    });
  });
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
