const express = require('express');
const userController = require('../controllers/user.controller');
const asyncHandler = require('express-async-handler');

const router = express.Router();


//localhost:4050/api/auth/register
router.post('/register', asyncHandler(insert));

async function insert(req, res, next) {
  const user = req.body
  console.log('register user', req.body);
  const saveUser = await userController.insert(user);
  res.json(user);
}

module.exports = router;
