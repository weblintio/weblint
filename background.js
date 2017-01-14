const trimHostname = function (hostname) {
  return hostname.replace(/^www\./,'');
};

const getCSSURL = function (hostname) {
  return "https://rawgit.com/weblintio/core-rules/master/rules/"+hostname+".css";
};

const removeStyle = {
  code: `
    var styleElement = document.getElementById('weblint-style');
    if (!!styleElement) {
      document.head.removeChild(styleElement);
    }
    `,
}

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
  if (changeInfo.status != 'loading') {
    return;
  }

  const { hostname, pathname } = new URL(tab.url);

  const trimmedHostname = trimHostname(hostname);

  const cssURL = getCSSURL(trimmedHostname);
  const xhttp = new XMLHttpRequest();
  xhttp.open("GET", cssURL, true);
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {

      const addStyle = {
        code: `
          var styleElement = document.createElement('style');
          styleElement.id = 'weblint-style';
          styleElement.appendChild(document.createTextNode("${this.response.replace(/(\r\n|\n|\r)/gm,"")}"));
          document.head.appendChild(styleElement);
          document.weblint = true;
          `,
        runAt: 'document_start'
      }

      chrome.tabs.executeScript(tabId, addStyle);
    }
  };
  xhttp.send();
});

chrome.browserAction.onClicked.addListener(function(tab) {
  chrome.tabs.executeScript(tab.tabId, removeStyle);
});
