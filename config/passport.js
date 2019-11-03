const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');

const userModel = require('../server/Models/User');

module.exports = function(passport) {
    passport.use(
        new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
            // Match User
            userModel.findUserByEmail(email)
                .then(rows => {
                    if(!rows) {
                        return done(null, false, { message: 'That email is not registered'})
                    }

                    bcrypt.compare(password, rows[0].user_password, (err, isMatch) => {
                        if(err) throw err;

                        if(isMatch) {
                            return done(null, rows[0])
                        } else {
                            return done(null, false, { message: 'Password Incorrect' })
                        }
                    });
                });
        })
    );


    passport.serializeUser((user, done) => {
      done(null, user.user_id);
    });

    passport.deserializeUser((id, done) => {
      userModel.findUserById(id)
        .then(rows => {
            done(null, rows[0])
        })
    });
}