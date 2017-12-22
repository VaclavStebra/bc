'use strict';

module.exports = function(server) {

    const io = require('socket.io')(server);

    var rooms = {};

    io.on('connection', function (socket) {

        socket.on('init', function (room, email, id) {
            socket.room = room;
            socket.user = { email: email, id: id };
            socket.join(room);
            if (room in rooms) {
                rooms[room].push(socket);
                socket.to(room).emit('peer.connected', socket.user);
                console.log(socket.user.email, 'has joined room', room);
            } else {
                rooms[room] = [socket];
                console.log(socket.user.email, 'has created room', room);
            }
        });

        socket.on('chat message', function (msg) {
            console.log('got message: ' + msg);
            console.log('sending message to room: '+ socket.room);
            socket.to(socket.room).emit('chat message', msg);
        });

        socket.on('webrtc.message', function (msg) {
            var filteredSockets = rooms[socket.room].filter(function (s) {
                return s.user.id === msg.to;
            });
            if (filteredSockets.length === 0) {
                console.warn('Cannot send message to user with id ', msg.to);
                return;
            }
            var s = filteredSockets[0];
            s.emit('webrtc.message', msg);
            console.log('sending message to', msg.to, 'from', msg.from);
        });

        socket.on('disconnect', function () {
            if ( ! socket.room) {
                return;
            }
            socket.leave(socket.room);
            socket.to(socket.room).emit('peer.disconnected', socket.user);
            console.log(socket.user.email, 'has left room', socket.room);

            var indexOfSocket = rooms[socket.room].indexOf(socket);
            if (indexOfSocket > -1) {
                rooms[socket.room].splice(indexOfSocket, 1);
            }

            if (rooms[socket.room].length === 0) {
                delete rooms[socket.room];
            }

            socket.room = null;
        });

    });
};