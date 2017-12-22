'use strict';

const path = require('path');

module.exports = {
    root: path.join(__dirname, '..'),
    db: 'mongodb://localhost/meeting_portal',
    email: {
        host: 'localhost',
        secure: false,
    }
};

