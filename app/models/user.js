'use strict';

const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const UserSchema = new Schema({
    email: String,
    hashed_password: String
});

mongoose.model('User', UserSchema);


