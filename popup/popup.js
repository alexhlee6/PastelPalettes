function save_options() {
  var color = document.getElementById('themeColor').value;
  var useOriginalFont = document.getElementById('useOriginalFont').value === "originalfont";
  // console.log(color);
  chrome.storage.sync.set({
    themeColor: color,
    useOriginalFont: useOriginalFont
  }, function () {
    // Update saveButton to let user know options were saved.
    var saveButton = document.getElementById('save');
    saveButton.disabled = true;
    saveButton.textContent = 'Saved!';
    setTimeout(function () {
      saveButton.textContent = 'Save';
      saveButton.disabled = false;
    }, 750);
  });
  chrome.tabs.query({ status: 'complete' }, (tabs) => {
    tabs.forEach((tab) => {
      let regexPage = new RegExp(/https:\/\/twitter.com\//);
      let match = regexPage.exec(tab.url);
      if (match) {
        chrome.tabs.update(tab.id, { url: tab.url });
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
    document.getElementById('useOriginalFont').value = (items.useOriginalFont ? "originalfont" : "");
  });
}
document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click',
  save_options);
