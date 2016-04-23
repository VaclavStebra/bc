'use strict';

$(document).ready(function() {

    var self = this;
    var stream;
    var peers = [];
    var rtcPeerConnectionConfig = {'iceServers': [{ 'url': 'stun:stun.l.google.com:19302' }]};
    var peerConnections = {};

    $('#chat-message').on('keypress', function(e) {
        if (e.which === 13) {
            self.sendMessage();
        }
    });

    $('#send-message').click(function() {
        self.sendMessage();
    });

    self.socket = io.connect('https://mtg.sde.cz');
    self.socket.emit('init', MEETING_ID, USER_EMAIL, USER_ID);

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

    self.socket.on('peer.connected', function(user) {
        toastr.info(user.email + ' has joined the conference');
        self.makeOffer(user.id);
    });

    self.socket.on('peer.disconnected', function (user) {
        toastr.warning(user.email + ' has left the conference');
        peers = peers.filter(function (peer) {
            return peer.id !== user.id;
        });
    });

    self.socket.on('webrtc.message', function(message) {
        self.handleMessage(message);
    });

    self.createPeerConnection = function (id) {
        if (peerConnections[id]) {
            return peerConnections[id];
        }
        var peerConnection = new RTCPeerConnection(rtcPeerConnectionConfig);
        peerConnections[id] = peerConnection;
        peerConnection.addStream(stream);
        peerConnection.onicecandidate = function (candidate) {
            self.socket.emit('webrtc.message', {from: USER_ID, to: id, ice: candidate.candidate, type: 'ice'});
        };
        peerConnection.onaddstream = function(stream) {
            var s = URL.createObjectURL(stream.stream);
            peers.push({id: id, stream: s});
            var video = $('<video></video>');
            video.attr('id', id);
            video.attr('autoplay', 'autoplay');
            video.addClass('remote-video');
            video.attr('src', s);
            $('#remote').append(video);
        };
        return peerConnection;
    };

    self.makeOffer = function(id) {
        var peerConnection = self.createPeerConnection(id);
        peerConnection.createOffer(function (sdp) {
            peerConnection.setLocalDescription(sdp);
            self.socket.emit('webrtc.message', {from: USER_ID, to: id, sdp: sdp, type: 'sdp-offer'});
        }, function (e) {
            console.error(e);
        }, {mandatory: {offerToReceiveVideo: true, offerToReceiveAudio: true}});
    };

    self.handleMessage = function (data) {
        var peerConnection = self.createPeerConnection(data.from);
        switch (data.type) {
            case 'sdp-offer':
                peerConnection.setRemoteDescription(new RTCSessionDescription(data.sdp), function () {
                    var promise = peerConnection.createAnswer();
                    promise.then(function (sdp) {
                        peerConnection.setLocalDescription(sdp);
                        self.socket.emit('webrtc.message', {from: USER_ID, to: data.from, sdp: sdp, type: 'sdp-answer'});
                    });
                }, function (e) {console.log(e)});
                break;
            case 'sdp-answer':
                peerConnection.setRemoteDescription(new RTCSessionDescription(data.sdp), function () {}, function(e) {
                    console.error(e);
                });
                break;
            case 'ice':
                if (data.ice) {
                    peerConnection.addIceCandidate(new RTCIceCandidate(data.ice));
                }
                break;
        }
    };

    navigator.getUserMedia({video: true, audio: true}, function (s) {
        stream = s;
        $('#local-video').attr('src', URL.createObjectURL(stream));
    }, function (e) {
        console.error(e);
    });

    toastr.options = {
        "closeButton": false,
        "debug": false,
        "newestOnTop": true,
        "progressBar": false,
        "positionClass": "toast-bottom-left",
        "preventDuplicates": false,
        "onclick": null,
        "showDuration": "300",
        "hideDuration": "1000",
        "timeOut": "5000",
        "extendedTimeOut": "1000",
        "showEasing": "swing",
        "hideEasing": "linear",
        "showMethod": "fadeIn",
        "hideMethod": "fadeOut"
    };

});
