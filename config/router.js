'use strict';

const users = require('../app/controllers/users');
const meetings = require('../app/controllers/meetings');
const auth = require('./authorization');

module.exports = function (app, passport) {

    app.use(function(req, res, next) {
        res.locals.req = req;
        next();
    });

    app.get('/', auth.requiresAuth, meetings.index);
    app.get('/meetings/create', auth.requiresAuth, meetings.plan);
    app.post('/meetings/create', auth.requiresAuth, meetings.create);

    app.get('/register', users.registerForm);
    app.post('/register', users.register);

    app.get('/login', users.index);
    app.post('/login', passport.authenticate('local', {
        failureRedirect: '/',
        failureFlash: 'Invalid email or password.'
    }), users.login);

    app.get('/logout', users.logout);

    app.use(function (err, req, res, next) {
        // treat as 404
        if (err.message
            && (~err.message.indexOf('not found')
            || (~err.message.indexOf('Cast to ObjectId failed')))) {
            return next();
        }

        console.error(err.stack);

        if (err.stack.includes('ValidationError')) {
            res.status(422).render('422', { error: err.stack });
            return;
        }

        // error page
        res.status(500).render('500', { error: err.stack });
    });

    // assume 404 since no middleware responded
    app.use(function (req, res) {
        res.status(404).render('404', {
            url: req.originalUrl,
            error: 'Not found'
        });
    });
};