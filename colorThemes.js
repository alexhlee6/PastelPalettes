// console.log(document.head)

// // const overwriteCSS = (color) => {
// //   let linkElement = this.document.createElement('link');
// //   linkElement.setAttribute('rel', 'stylesheet');
// //   linkElement.setAttribute('type', 'text/css');
// //   linkElement.setAttribute('href', `./css/${color}.css`);
// //   return linkElement;
// // }

// // let linkEl = overwriteCSS('pink');
// // console.log(linkEl);
// // document.head.appendChild(linkEl);
// // chrome.tabs.insertCSS('css/pink.css')

// chrome.browserAction.onClicked.addListener(browserListener);

// var browserListener = function (tab) {
//   alert("IN LISTENER");
//   var regexPage = new RegExp(/https:\/\/twitter.com\//); // We use a regular expresion to check which page was given.
//   var match = regexPage.exec(tab.url); // We then check if the given page matches our expression.
//   // If it matches and the status of the tab is complete...
//   if (match && tab.status === 'complete') {
//     //We insert the css
//     chrome.tabs.insertCSS(tab.id, {
//       file: "css/pink.css"
//     });
//   }
// }