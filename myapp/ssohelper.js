const moment = require("moment");
const { uuid } = require("./utils");
const jwt = require('jsonwebtoken');

const EPOCH = '19700101';
const EPOCH_DATEFORMAT = 'YYYYMMDD';
const { SECRET } = require('./constants');

// This method returns the username from the login cookie, or null if no user is logged in.
const extractUserFromCookie = (req) => {

    // Get the correct cookie from the request
    var cookie = req.cookies['user_name'];

    // Return the cookie's value
    return cookie;
}

const extractReturnToFromRequest = (req) => {
    return decodeURIComponent(req.body.redirectTo);
}

const extractUserFromRequest = (req) => {

    // Get the username from the request
    var value = req.body['username'];

    // Return the  value
    return value;
}

const generateJWTPayload = (username) => {
    // bugfix - changed to seconds to avoid iat calculation issue mentioned by Daniel 
    const timeSinceEpoch = moment().valueOf() - moment(EPOCH, EPOCH_DATEFORMAT).valueOf();
    const timeInSeconds = Math.floor(timeSinceEpoch / 1000)  ;
    //console.log(' timeSinceEpoch : ', timeSinceEpoch);
    return {
        "iat": timeInSeconds,
        "sub": username,
        "jti": uuid(),
        "user_email" : username,
        "first_name" : "Saneesh",
        "last_name" : "George"
    };
}

// This function encodes a JWT object
const encodeJWT = (payload) => {
    const token = jwt.sign(payload, SECRET, { algorithm: 'HS256' });
    console.log(' token : ', token);
    return token;
}

module.exports = { generateJWTPayload, extractUserFromCookie, encodeJWT, extractUserFromRequest , extractReturnToFromRequest};