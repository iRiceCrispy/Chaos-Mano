const express = require('express');
const asyncHandler = require('express-async-handler');
const { requireAuth } = require('../../utils/auth');
const { Notification } = require('../../models');

const router = express.Router();

router.get('/', requireAuth, asyncHandler(async (req, res) => {
  const { user } = req;

  const notifications = await Promise.all(Object.values(Notification.discriminators)
    .map(discriminator => discriminator.find({ receivers: { $elemMatch: { userId: user.id } } })))
    .then(promiseResults => promiseResults.reduce((arr, el) => arr.concat(el), []));

  res.json(notifications);
}));

module.exports = router;
