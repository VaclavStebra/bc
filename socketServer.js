'use strict';

module.exports = function(server) {
    const io = require('socket.io')(server);

    io.on('connection', function (socket) {
        console.log('conencted');
        socket.on('chat message', function (msg) {
            console.log('got message: ' + msg);
            socket.broadcast.emit('chat message', msg);
        });
    });
};