'use strict';

var urls = [],
    port = chrome.runtime.connect({name: 'options'});
    port.onMessage.addListener(function(response) {
      $('#status').html($.map(response, function(r) {
        return r.url + ': ' + r.status
      }).join("<br>"));
      $('#url').val('');
      setDisabled(false);
    });

chrome.storage.local.get('urls', function(response) {
  urls = response.urls;
});

function sendMessage(action, urls) {
  port.postMessage({action: action, urls: urls});
}

function setDisabled(disabled) {
  $('#url').prop('disabled', disabled);
  $('#addURL').prop('disabled', disabled);
  $('#delURL').prop('disabled', disabled);
}

$(document).ready(function() {
  $('#addURL').click(function() {
    var urls = $.map($('#url').val().toLowerCase().trim().split(/[,\s]+/), function(url) {return url.trim()});
    if (urls.length > 1 || (urls.length === 1 && urls[0] !== '')) {
      sendMessage('add', urls);
      setDisabled(true);
    }
  });
  $('#delURL').click(function() {
    var urls = $.map($('#url').val().toLowerCase().trim().split(/[,\s]+/), function(url) {return url.trim()});
    if (urls.length > 1 || (urls.length === 1 && urls[0] !== '')) {
      sendMessage('delete', urls);
      setDisabled(true);
    }
  });
});
