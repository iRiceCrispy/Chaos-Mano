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

  const normalizedNotifications = notifications.map((noti) => {
    const receiver = noti.receivers.find(re => re.userId.toString() === user.id);
    const notification = noti.toJSON();

    notification.read = receiver.hasRead;

    delete notification.receivers;

    return notification;
  });

  res.json(normalizedNotifications);
}));

module.exports = router;
