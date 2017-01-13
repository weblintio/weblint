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

      const experiment = {
        code: `
          var styleElement = document.createElement('style');
          styleElement.id = 'weblint-style';
          styleElement.appendChild(document.createTextNode("${this.response.replace(/(\r\n|\n|\r)/gm,"")}"));
          document.head.appendChild(styleElement);
          `,
        runAt: 'document_start'
      }

      chrome.tabs.executeScript(tabId, experiment);
    }
  };
  xhttp.send();
});

const trimHostname = function (hostname) {
  return hostname.replace(/^www\./,'');
};

const getCSSURL = function (hostname) {
  return "https://rawgit.com/weblintio/core-rules/master/rules/"+hostname+".css";
};
