const fs = require('fs');
const { ExtractJwt } = require('passport-jwt');
const path = require('path');
const JwtStrategy = require("passport-jwt").Strategy
const ExtractJwt = require("passport-jwt").ExtractJwt

const pathToKey = path.join(__dirname, "public-key.pem");
const PUB_KEY = fs.readFileSync(pathToKey, 'utf8');


const options = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: PUB_KEY,
    algorithmx: ["RS256"]
};


module.exports = (passport) => {}

