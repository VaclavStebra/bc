'use strict';

$(document).ready(function() {

    var self = this;

    $('#chat-message').on('keypress', function(e) {
        if (e.which === 13) {
            self.sendMessage();
        }
    });

    $('#send-message').click(function() {
        self.sendMessage();
    });

    self.socket = io.connect('http://localhost:3000');
    self.socket.emit('join room', $('#meeting-id').val());

    self.socket.on('chat message', function(msg) {
        var message = $('<p class="bg-primary message"></p>');
        message.append(msg);
        $('#chat-messages').append(message);
    });

    self.sendMessage = function() {
        var messageContent = $('#chat-message').val();
        if ( ! messageContent) {
            return;
        }
        var message = $('<p class="bg-info message-right"></p>');
        message.append(messageContent);
        $('#chat-messages').append(message);
        self.socket.emit('chat message', messageContent);
        $('#chat-message').val('').focus();
    };

});