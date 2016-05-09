'use strict';

const mongoose = require('mongoose');
const nodemailer = require('nodemailer');
const config = require('../../config/config');

const Meeting = mongoose.model('Meeting');

exports.plan = function(req, res) {
    res.render('meetings/create');
};

exports.create = function(req, res) {
    var participants = req.body.participants.split(',');
    var name = req.body.name.substring(0, 55);
    var meeting = new Meeting({
        name: req.body.name,
        organizer: req.user.id,
        startDate: req.body.startDate,
        endDate: req.body.endDate,
        participants: participants
    });
    meeting.save(function(err) {
        if (err) throw err;
        console.log('Created meeting ' + meeting.name + ' organized by ' + req.user.email);
        sendLinkToParticipants(participants, req.user.id);
    });
    res.redirect('/meetings/' + meeting.id);
};

exports.meeting = function(req, res) {
    if (req.meeting.startDate > new Date()) {
        res.render('meetings/summary', {
            meeting: req.meeting,
            info: req.flash('info'),
            errors: req.flash('error'),
            success: req.flash('success'),
            warning: req.flash('warning')
        });
    } else if (req.meeting.endDate < new Date()) {
        res.render('meetings/ended', {
            meeting: req.meeting,
            info: req.flash('info'),
            errors: req.flash('error'),
            success: req.flash('success'),
            warning: req.flash('warning')
        });
    } else {
        res.render('meetings/meeting', {
            meeting: req.meeting,
            info: req.flash('info'),
            errors: req.flash('error'),
            success: req.flash('success'),
            warning: req.flash('warning')
        })
    }
};

exports.loadMeeting = function(req, res, next, id) {
    Meeting
        .findOne({_id: id})
        .select('name organizer startDate endDate participants')
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

function sendLinkToParticipants(id, participants, organizer) {
    var transporter = nodemailer.createTransport(config.email);
    var mailOptions = {
        to: participants.join(','),
        subject: 'Meeting invitation',
        html: '<p>You have been invited to the meeting organized by ' + organizer + '.' +
        ' You can attend the meeting using following link: <a href="https://mtg.sde.cz/meetings/' + id + '>https://mtg.sde.cz/meetings/' + id + '</a>"</p>'
    };
    transporter.sendMail(mailOptions, function(error, info) {
        if (error) {
            return console.log(error);
        }
        console.log('Email sent ' + info.response);
    });
}
