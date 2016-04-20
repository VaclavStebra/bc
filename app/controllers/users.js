'use strict';

const mongoose = require('mongoose');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

const User = mongoose.model('User');

exports.index = function (req, res) {
    res.render('users/login', {
        info: req.flash('info'),
        errors: req.flash('error'),
        success: req.flash('success'),
        warning: req.flash('warning')
    });
};

exports.logout = function(req, res) {
    req.logout();
    res.redirect('/');
};

exports.registerForm = function (req, res) {
    res.render('users/register');
};

exports.register = function (req, res) {
    var email = req.body.email;
    var password = req.body.password;
    var hash = crypto.createHmac('sha256', 'secret').update(password).digest('hex')
    console.log(hash);
    var user = new User({
        email: email,
        hashed_password: hash
    });

    user.save(function(err) {
        if (err) throw err;
        console.log('Created user ' + email);
    });

    req.logIn(user, function (err) {
        if (err) {
            req.flash('info', 'Error when logging in. Please try again.');
            return res.redirect('/');
        }
        return res.redirect('/');
    });
};

exports.authCallback = login;
exports.login = login;

function login (req, res) {
    const redirectTo = req.session.returnTo ? req.session.returnTo : '/meetings';
    delete req.session.returnTo;
    res.redirect(redirectTo);
};