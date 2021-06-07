const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const Admin = require('../models/admin');
const { matchPassword } = require('../lib/helpers');
passport.use(
  'local_signin',
  new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password',
      passReqToCallback: true,
    },
    async (req, email, password, done) => {
      const user = await Admin.find({ email: email.trim() });
      if (user.length > 0) {
        console.log(user.length, '==================aqui');
        const validPassword = await matchPassword(password, user[0].password);
        if (validPassword) {
          done(null, user, req.flash('success', 'Welcome', user.email));
        } else {
          done(null, false, req.flash('err', 'Email o contraseña icorrectos'));
        }
      } else {
        return done(null, false, req.flash('err', 'Email o contraseña icorrectos'));
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user[0]._id);
});

passport.deserializeUser(async (id, done) => {
  let user = await Admin.find({ _id: id });
  done(null, user[0]._id);
});
