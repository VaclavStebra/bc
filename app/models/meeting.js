'use strict';

const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const MeetingSchema = new Schema({
    name: String,
    organizer: { type: Schema.Types.ObjectId, ref: 'User'},
    startDate: Date,
    plannedEndDate: Date,
    endDate: Date,
    participants: [],
    transcript: []
});

mongoose.model('Meeting', MeetingSchema);


