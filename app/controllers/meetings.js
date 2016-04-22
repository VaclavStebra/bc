'use strict';

const mongoose = require('mongoose');

const Meeting = mongoose.model('Meeting');

exports.plan = function(req, res) {
    res.render('meetings/create');
};

exports.create = function(req, res) {
    var meeting = new Meeting({
        name: req.body.name,
        organizer: req.user.id,
        startDate: req.body.startDate,
        endDate: req.body.endDate,
        participants: req.body.participants
    });
    meeting.save(function(err) {
        if (err) throw err;
        console.log('Created meeting ' + meeting.name + ' organized by ' + req.user.email);
    });
    res.redirect('/meetings/summary/' + meeting.id);
};

exports.summary = function(req, res) {
    res.render('meetings/summary', {
        meeting: req.meeting,
        info: req.flash('info'),
        errors: req.flash('error'),
        success: req.flash('success'),
        warning: req.flash('warning')
    });
};

exports.meeting = function(req, res) {
    res.render('meetings/meeting');
};

exports.loadMeeting = function(req, res, next, id) {
    Meeting
        .findOne({_id: id})
        .select('name organizer startDate endDate')
        .populate('organizer', 'email')
        .exec(function (err, meeting) {
            if (err) {
                next(err);
            } else if (meeting) {
                req.meeting = meeting;
                next();
            } else {
                next(new Error('Failed to load meeting ' + id));
            }
        });
};