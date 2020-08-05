const passport = require('passport');
const LocalStrategy = require('passport-local');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt;

const config = require('../config/config');
const userController = require('../controllers/user.controller');

const localLogin = new LocalStrategy({usernameField: 'email'}, async (email, password, done) => {

  const user = await userController.login(email, password);
  return user ? done(null, user) : done(null,false, {error: 'Login failed!'});
})

const jwtLogin = new JwtStrategy(
  {
    jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
    secretOrKey: config.jwtSecretKey
  },
  async (payload, done) => {
    const userData = JSON.parse(payload.user)
    const user = await userController.getUserById(userData._id);
    return user? done(null, user):done(null, false, {
      error: 'Login failed!'
    });
  }
);

module.exports = passport.use(localLogin).use(jwtLogin);
