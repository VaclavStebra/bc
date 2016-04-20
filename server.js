'use strict';

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

connectToDb()
    .on('error', console.log)
    .on('disconnected', connectToDb)
    .once('open', startServer);

function startServer() {
    app.listen(port);
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