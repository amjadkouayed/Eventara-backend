const passport = require("passport")
const LocalStrategy = require("passport-local").Strategy
const bcrypt = require("bcrypt")
const pool = require("../db")

function configureLocalPassport(passport) {
  
  passport.use( new LocalStrategy(
  { usernameField: "email" }, async (email, password, done) => {
      try {
          
          const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
          
          if (result.rows.length === 0) {
            return done(null, false);
          }
          
          const user = result.rows[0]

          const isMatch = await bcrypt.compare(password, user.password);
          if (!isMatch) {
            
            return done(null, false);
          }
  
          return done(null, user);
          
        }catch(err) {
          console.error('Error during authentication:', err.message)
          done(err, null)
      }

  }
))}

passport.serializeUser((user, done) => { done(null, user.id) })
passport.deserializeUser( async (id, done) => {

  try {

    const result = await pool.query('SELECT * FROM users WHERE id = $1;', [id]);

    if (result.rows.length === 0) {
      return done(null, false); 
    }

    const user = result.rows[0];
  
    done(null, user); 
  } catch(err) {
    console.log("ERROR")
    done(err, null)
  }
    
}) 

module.exports = configureLocalPassport

