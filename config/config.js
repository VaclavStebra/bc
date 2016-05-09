'use strict';

const path = require('path');

module.exports = {
    root: path.join(__dirname, '..'),
    db: 'mongodb://localhost/meeting_portal',
    email: {
        host: 'localhost',
        port: 465,
        secure: true,
        auth: {
            user: 'TODO',
            pass: 'TODO'
        }
    }
};

