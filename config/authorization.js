'use strict';

exports.requiresAuth = function(req, res, next) {
    if (req.isAuthenticated()) return next();
    if (req.method === 'GET') {
        req.session.returnTo = req.originalUrl;
    }
    res.redirect('/login');
}