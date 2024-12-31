const fs = require('fs');
const { ExtractJwt } = require('passport-jwt');
const path = require('path');
const JwtStrategy = require("passport-jwt").Strategy
const ExtractJwt = require("passport-jwt").ExtractJwt
const pool = require("../db")

const pathToKey = path.join(__dirname, "public-key.pem");
const PUB_KEY = fs.readFileSync(pathToKey, 'utf8');


const options = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: PUB_KEY,
    algorithmx: ["RS256"]
};

const strategy = new JwtStrategy(options, async (payload, done) => {
    const user_id = payload.sub
    try {
        const result = await pool.query('SELECT * FROM users WHERE id = $1', [user_id]);

        if (result.rows.length === 0) {
            return done(null, false);
        }

        const user = result.rows[0]

        return done(null, user)


    } catch(error) {
        return done(error, null)

    }
    

})

module.exports.configureJwtPassport = (passport) => {
    passport.use()
}

