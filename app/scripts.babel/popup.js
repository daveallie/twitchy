'use strict';

var port = chrome.runtime.connect({name: 'channel_data'});
port.postMessage({force: false});
port.onMessage.addListener(function(response) {
  console.log(response.channels);
  if (response.success) {
    var $table = $('#info table');
    $table.empty();

    var $tbody = $(crel($table[0],
      crel('tr',
        crel('th', 'Name'),
        crel('th', 'Game'),
        crel('th', 'Viewers'),
        crel('th', 'Started')),
      crel('tbody')
    )).children('tbody');

    var crelArgs = [$tbody[0]];
    $.each(response.channels, function(_, channel) {
      if (channel.streaming) {
        crelArgs.push(crel('tr', {class: 'online'}, crel('td', {class: 'name'}, channel.display + ':'), crel('td', channel.data.game), crel('td', channel.data.viewers), crel('td', $.timeago(channel.data.created_at))));
      } else {
        crelArgs.push(crel('tr', {class: 'offline'}, crel('td', {class: 'name'}, channel.display + ':'), crel('td', '-'), crel('td', '-'), crel('td', '-')));
      }
    });

    crel.apply(this, crelArgs);
  } else {
      console.error('fail');
  }
});
