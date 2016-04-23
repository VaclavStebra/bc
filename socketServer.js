'use strict';

module.exports = function(server) {
    const io = require('socket.io')(server);

    io.on('connection', function (socket) {

        console.log('connected');

        socket.on('chat message', function (msg) {
            console.log('got message: ' + msg);
            console.log('sending message to room: '+ socket.room);
            socket.to(socket.room).emit('chat message', msg);
        });

        socket.on('join room', function (room) {
            console.log('socket joined room ' + room);
            socket.room = room;
            socket.join(room);
        });
    });
};