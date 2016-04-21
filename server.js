'use strict';

const fs = require('fs');
const https = require('https');
const privateKey = fs.readFileSync('/etc/ssl/mtg/mtg.sde.cz.key');
const certificate = fs.readFileSync('/etc/ssl/mtg/mtg.sde.cz.crt');
const credentials = {key: privateKey, cert: certificate};

const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');

const config = require('./config/config');

const port = 3000;
const app = express();

module.exports = app;

require('./app/models/user');
require('./app/models/meeting');

require('./config/passport')(passport);
require('./config/express')(app, passport);
require('./config/router')(app, passport);

const httpsServer = https.createServer(credentials, app);

connectToDb()
    .on('error', console.log)
    .on('disconnected', connectToDb)
    .once('open', startServer);

function startServer() {
    httpsServer.listen(port);
    console.log('App started on port ' + port);
}

function connectToDb() {
    var options = {
        server: {
            socketOptions: {
                keepAlive: 1
            }
        }
    };
    return mongoose.connect(config.db, options).connection;
}
