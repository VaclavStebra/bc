'use strict';

const mongoose = require('mongoose');

const Meeting = mongoose.model('Meeting');

exports.index = function(req, res) {
    Meeting
        .find({})
        .select('name organizer startDate')
        .populate('organizer', 'email')
        .exec(function (err, meetings) {
        if (err) throw err;
        res.render('meetings/index', {
            meetings: meetings,
            info: req.flash('info'),
            errors: req.flash('error'),
            success: req.flash('success'),
            warning: req.flash('warning')
        });
    });
};

exports.plan = function(req, res) {
    res.render('meetings/create');
};

exports.create = function(req, res) {
    var meeting = new Meeting({
        name: req.body.name,
        organizer: req.user.id,
        startDate: req.body.startDate,
        plannedEndDate: req.body.plannedEndDate,
        participants: req.body.participants,
        transcript: []
    });
    meeting.save(function(err) {
        if (err) throw err;
        console.log('Created meeting ' + meeting.name + ' organized by ' + req.user.email);
    });
    req.flash('success', 'You have created new meeting');
    res.redirect('/');
};