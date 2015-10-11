'use strict';

var urls = [],
    port = chrome.runtime.connect({ name: 'options' });
port.onMessage.addListener(function (response) {
  console.log(response);
  $('#status').html($.map(response, function (r) {
    return r.url + ': ' + r.status;
  }).join("<br>"));
});

chrome.storage.local.get('urls', function (response) {
  urls = response.urls;
});

function sendMessage(action, urls) {
  port.postMessage({ action: action, urls: urls });
}

function addURL() {
  var url = $('#url').val().trim().toLowerCase();
  if (url !== '') {
    sendMessage('add', [url]);
  }
}

$(document).ready(function () {
  $('#addURL').on('click', function () {
    addURL();
  });
});
//# sourceMappingURL=options.js.map
