'use strict';

const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const MeetingSchema = new Schema({
    name: String,
    organizer: { type: Schema.Types.ObjectId, ref: 'User'},
    startDate: Date,
    endDate: Date,
    participants: []
});

mongoose.model('Meeting', MeetingSchema);


