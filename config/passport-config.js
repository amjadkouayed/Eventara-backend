const fs = require("fs");
const path = require("path");
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const { PrismaClient } = require("@prisma/client");

const pathToKey = path.join(__dirname, "public-key.pem");
const PUB_KEY = fs.readFileSync(pathToKey, "utf8");

const prisma = new PrismaClient();

const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: PUB_KEY,
  algorithms: ["RS256"],
};

const strategy = new JwtStrategy(options, async (payload, done) => {
  const user_id = payload.sub;
  try {
    const result = await prisma.users.findUnique({
      where: {
        id: user_id,
      },
    });
    if (result.length === 0) {
      return done(null, false);
    }

    const user = result;

    return done(null, user);
  } catch (error) {
    return done(error, null);
  }
});

module.exports.configureJwtPassport = (passport) => {
  passport.use(strategy);
};
