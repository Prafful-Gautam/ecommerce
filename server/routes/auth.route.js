const express = require('express');
const userController = require('../controllers/user.controller');
const asyncHandler = require('express-async-handler');
const authController = require('../controllers/auth.controller');
const passport = require('../middleware/passport');

const router = express.Router();


//localhost:4050/api/auth/register
router.post('/register', asyncHandler(insert), login);
router.post('/login', asyncHandler(getUserByEmailAndPassword), login);
router.get("/findme",passport.authenticate("jwt", {session: false}), login);

async function sendBack(req, res) {
  res.json({user: req.body, token: req.headers.authorization});
}

async function insert(req, res, next) {
  const user = req.body
  console.log('register user', req.body);
  req.user = await userController.insert(user);
  next();
}

async function getUserByEmailAndPassword(req, res, next){
  const user = req.body;
  console.log('searching user for ', user);

  const savedUser = await userController.login(user.email, user.password);
 req.user = savedUser;
  next();
}

async function login(req, res) {
  const user = req.user;
  console.log('-------->',req.user)
  const token = authController.generateToken(user);
  const expiresIn = 3600;
  res.json({user, token, expiresIn});
}

module.exports = router;
