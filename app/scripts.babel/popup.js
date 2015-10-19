'use strict';

var $message = $('#message');
$message.html('LOADING...');
$message.show();
var port = chrome.runtime.connect({name: 'channel_data'});
port.postMessage({force: false});
port.onMessage.addListener(function(response) {
  if (response.success) {
    $message.hide();
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
        crelArgs.push(crel('tr', {class: 'online'}, crel('td', {class: 'name', 'data-url': 'http://www.twitch.tv/' + channel.url}, channel.display + ':'), crel('td', channel.data.game), crel('td', channel.data.viewers), crel('td', $.timeago(channel.data.created_at))));
      } else {
        crelArgs.push(crel('tr', {class: 'offline'}, crel('td', {class: 'name', 'data-url': 'http://www.twitch.tv/' + channel.url}, channel.display + ':'), crel('td', '-'), crel('td', '-'), crel('td', '-')));
      }
    });

    crel.apply(this, crelArgs);

    $('.name').click(function() {
      chrome.tabs.create({url: $(this).data('url') + '/popout'});
    });
  } else {
    $message.html('Error, please try again.');
    console.error('fail');
  }
});
