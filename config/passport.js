'use strict';

const mongoose = require('mongoose');
const LocalStrategy = require('passport-local').Strategy;
const crypto = require('crypto');
const User = mongoose.model('User');

var localStrategy = new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password'
    }, function (email, password, done) {
        const options = {
            criteria: {email: email},
            select: 'email hashed_password'
        };
        User.findOne(options.criteria).select(options.select).exec(function (err, user) {
            if (err) return done(err);
            if ( ! user) {
                return done(null, false, { message: 'User with this email was not found in the database'});
            }
            var hash = crypto.createHmac('sha256', 'secret').update(password).digest('hex');
            if (user.hashed_password !== hash) {
                console.log('wrong password');
                return done(null, false, { message: 'Invalid password'});
            }
            return done(null, user);
        });
});

module.exports = function (passport) {
    passport.serializeUser(function (user, cb) {
        cb(null, user.id);
    });
    passport.deserializeUser(function (id, cb) {
        User.findOne({_id: id}).select('email hashed_password').exec(cb);
    });

    passport.use(localStrategy);
};