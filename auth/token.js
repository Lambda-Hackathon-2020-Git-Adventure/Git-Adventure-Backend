const jwt = require('jsonwebtoken');
const db = require('../data/db-config');

const secret = process.env.JWT_SECRET || 'hackathon 2020 champions';

function generateToken(user){
    const payload = {
        subject: user.id,
    }

    const options = {
        expiresIn: '3d'
    };
    return jwt.sign(payload, secret, options)
}

module.exports = {
    secret,
    generateToken
}