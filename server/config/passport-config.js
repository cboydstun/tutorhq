var passport = require('passport');
var GoogleStrategy = require('passport-google-oauth20').Strategy;
var db = require('../../database/models/index.js');
var authCtrl = require('../../database/controllers/authController.js');

require('dotenv').config();

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((_id, done) => {
  db.User.findById(_id, function(err, user) {
    done(err, user);
  });
});

passport.use(
  new GoogleStrategy(
    {
      clientID: '963247453896-ph4m2mpu8duq81pvengo9ofg5n35f1ds',
      clientSecret: 'vI96oViE17Uhy_rryD1lTmGa',
      callbackURL: '/auth/google/redirect',
      passReqToCallback: true,
    },
    (req, accessToken, refreshToken, profile, done) => {
      console.log('THIS IS THE PROFILE: ', profile);
      const username = profile.emails[0].value.slice(
        0,
        profile.emails[0].value.indexOf('@')
      );
      authCtrl.findOrCreate(
        {
          googleId: profile.id,
          sessionID: req.sessionID,
          name: profile.displayName,
          email: profile.emails[0].value,
          username: username,
          description: '',
        },
        function(err, user) {
          return done(err, user);
        }
      );
    }
  )
);
