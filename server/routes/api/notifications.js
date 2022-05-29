const express = require('express');
const asyncHandler = require('express-async-handler');
const { requireAuth } = require('../../utils/auth');
const { Notification } = require('../../models');

const router = express.Router();

router.get('/', requireAuth, asyncHandler(async (req, res) => {
  const { user } = req;
  const notifications = await Notification.find({ receivers: { userId: user.id } });

  res.json(notifications);
}));

module.exports = router;
