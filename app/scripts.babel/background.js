'use strict';

var channels = [],// { url: 'sips_', display: null, streaming: false, data: null }],
                // { url: 'riotgames', display: null, streaming: false, data: null },
                // { url: 'crendor', display: null, streaming: false, data: null }],
    lastLoaded = 0;

function findChannelIndex(url) {
  for (var i = 0, len = channels.length; i < len; i++) {
    if (channels[i].url === url) {
      return i;
    }
  }
  return null;
}

function streamData() {
  return $.ajax({
    url: 'https://api.twitch.tv/kraken/streams',
    dataType: 'json',
    data: { channel: $.map(channels, function (channel) {
        return channel.url;
      }), limit: 100 }
  });
}

function getSingleChannelInfo(url) {
  return $.ajax({
    url: 'https://api.twitch.tv/kraken/channels/' + url,
    dataType: 'json'
  });
}

function channelInfo() {
  return new Promise(function (resolve, reject) {
    var urlsToFetch = $.grep($.map(channels, function (channel) {
      if (channel.display === null) {
        return channel.url;
      }
    }), function (n) {
      return n;
    });

    if (urlsToFetch.length > 0) {
      $.when.apply($, $.map(urlsToFetch, function (url) {
        return getSingleChannelInfo(url);
      })).then(function () {
        var broken = false,
            responses = [];

        if (urlsToFetch.length === 1) {
          responses.push(arguments);
        } else {
          responses = arguments;
        }

        for (var i = 0, len = responses.length; i < len; i++) {
          if (responses[i][1] === 'success') {
            channels[findChannelIndex(responses[i][0].name)].display = responses[i][0].display_name;
          } else {
            reject();
            broken = true;
            break;
          }
        }

        if (!broken) {
          resolve();
        }
      }, function () {
        console.error('failed');
        reject();
      });
    } else {
      resolve();
    }
  });
}

function resetStreamData() {
  for (var i = 0, len = channels.length; i < len; i++) {
    channels[i].streaming = false;
    channels[i].data = null;
  }
}

function reloadAll(callback) {
  $.when(streamData(), channelInfo()).then(function (streamDataResponse, _) {
    resetStreamData();
    var total = 0;
    $.each(streamDataResponse[0].streams, function (_, stream) {
      var i = findChannelIndex(stream.channel.name);
      if (i !== null) {
        channels[i].streaming = true;
        channels[i].data = stream;
        total += 1;
      }
    });

    if (total === 0) {
      chrome.browserAction.setBadgeText({ text: '' });
    } else {
      chrome.browserAction.setBadgeText({ text: total.toString() });
    }

    lastLoaded = Math.floor(new Date().getTime() / 1000);
    callback && callback({ channels: channels, success: true, reloaded: true });
  }, function () {
    console.error('fail');
    callback && callback({ channels: channels, success: false, reloaded: false });
  });
}

function sendMessage(port, message) {
  port.postMessage(message);
}

chrome.runtime.onInstalled.addListener(function (details) {
  chrome.alarms.create('update', {periodInMinutes: 5});

  chrome.runtime.onConnect.addListener(function (port) {
    if (port.name === 'channel_data') {
      port.onMessage.addListener(function (request) {
        if (request.force === true || Math.floor(new Date().getTime() / 1000) - lastLoaded > 1) {
          reloadAll(sendMessage.bind(this, port));
        } else {
          port.postMessage({ channels: channels, success: true, reloaded: false });
        }
      });
    }



    else if (port.name === 'options') {
      port.onMessage.addListener(function (request) {
        if (request.action === 'add') {
          var urls = $.map(channels, function(channel) {return channel.url}),
              toAdd = [],
              res = [];
          $.each(request.urls, function(_, url) {
            if ($.inArray(url, urls) === -1) {
              res.push({url: url, status: 'failed'});
              toAdd.push(url);
              urls.push(url);
              //channels.push({url: url, display: null, streaming: false, data: null});
              // urls.push(url);
            } else {
              res.push({url: url, status: 'exists'});
            }
          });

          $.when.apply($, $.map(toAdd, function (url) {
            return getSingleChannelInfo(url);
          })).then(function () {
            var responses = [];

            if (toAdd.length === 1) {
              responses.push(arguments);
            } else {
              responses = arguments;
            }

            for (var i = 0, len = responses.length; i < len; i++) {
              if (responses[i][1] === 'success' && responses[i][0].status !== 422) {
                channels.push({url: responses[i][0].name, display: responses[i][0].display_name, streaming: false, data: null});
                for (var j = 0, res_len = res.length; j < res_len; j++) {
                  if (res[j].url === responses[i][0].name) {
                    res[j].status = 'success';
                    break;
                  }
                }
                urls.push(responses[i][0].name);
              }
            }

            port.postMessage(res);
            reloadAll(false);
            chrome.storage.local.set({urls: urls});
          }, function () {
            console.error('failed');
            port.postMessage(res);
          });
        } else if (request.action === 'delete') {
          var remainingURLs = [],
              res = [];
          channels = $.grep($.map(channels, function (channel) {
            var idx = $.inArray(channel.url, request.urls);
            if (idx === -1) {
              remainingURLs.push(channel.url);
              return channel;
            } else {
              res.push({url: request.urls[idx], status: 'success'});
            }
          }), function (n) {
            return n;
          });

          var resUrls = $.map(res, function(result) {return result.url});
          console.log(resUrls);
          res = $.map(request.urls, function(url) {
            var idx = $.inArray(url, resUrls);
            if (idx === -1) {
              return {url: url, status: 'no_channel'};
            } else {
              return res[idx];
            }
          });

          port.postMessage(res);
          chrome.storage.local.set({urls: urls});
        }
      });
    }
  });

  chrome.alarms.onAlarm.addListener(function(alarm) {
    reloadAll(false);
  });
});

chrome.storage.local.get('urls', function(response) {
  var urls = [];

  if (response.urls === null) {
    chrome.storage.local.set({urls: []});
  } else {
    urls = response.urls;
  }

  channels = $.map(urls, function(url) {
    return {url: url, display: null, streaming: false, data: null};
  });

  reloadAll(false);
});
