const express = require('express');
const asyncHandler = require('express-async-handler');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { setTokenCookie } = require('../../utils/auth');
const { User } = require('../../models');

const router = express.Router();

const validateSignup = [
  check('email')
    .isEmail()
    .withMessage('Please provide a valid email.')
    .custom(async (email) => {
      const user = await User.findOne({ email });

      if (user) throw new Error('Email already registered.');
    }),
  check('username')
    .isLength({ min: 4 })
    .withMessage('Username must be at least 4 characters long.')
    .isLength({ max: 25 })
    .withMessage('Username cannot be longer than 25 characters.')
    .bail()
    .not()
    .isEmail()
    .withMessage('Username cannot be an email.')
    .custom(async (username) => {
      const user = await User.findOne({ username });

      if (user) throw new Error('Username already in use.');
      return true;
    }),
  check('password')
    .isLength({ min: 6 })
    .withMessage('Password must be 6 characters or more.'),
  check('confirmPassword')
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Password and Confirm Password does not match.');
      }
      return true;
    }),
  handleValidationErrors,
];

router.get('/', asyncHandler(async (req, res) => {
  const io = req.app.get('io');
  const sockets = await io.fetchSockets();
  const users = (await User.find()).map(user => JSON.parse(JSON.stringify(user)));
  const onlineUsers = new Set(sockets.map(s => s.userId));

  users.forEach((user) => {
    if (onlineUsers.has(user.id)) {
      user.status = 'online';
    }
    else {
      user.status = 'offline';
    }
  });

  return res.json(users);
}));

// Sign up
router.post('/', validateSignup, asyncHandler(async (req, res) => {
  const {
    email,
    username,
    password,
  } = req.body;

  const user = await User.signup({ email, username, password });

  setTokenCookie(res, user);

  return res.json(user.toPrivate());
}));

module.exports = router;
