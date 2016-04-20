'use strict';

const express = require('express');
const session = require('express-session');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const cookieSession = require('cookie-session');
const bodyParser = require('body-parser');
const flash = require('connect-flash');
const mongoStore = require('connect-mongo')(session);

const config = require('./config');

module.exports = function (app, passport) {

    app.use(express.static(config.root + '/public'));
    app.use(express.static(config.root + '/bower_components'));
    app.set('views', config.root + '/app/views');
    app.set('view engine', 'jade');

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));

    app.use(cookieParser());
    app.use(cookieSession({ secret: 'secret' }));
    app.use(session({
        resave: true,
        saveUninitialized: true,
        secret: 'secret',
        store: new mongoStore({
            url: config.db,
            collection : 'sessions'
        })
    }));

    app.use(passport.initialize());
    app.use(passport.session());

    app.use(flash());
};