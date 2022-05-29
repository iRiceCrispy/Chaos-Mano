const mongoose = require('mongoose');
const Notification = require('./Notification');

const DropNotificationSchema = new mongoose.Schema({
  dropId: {
    type: mongoose.ObjectId,
    require: true,
  },
  content: {
    type: String,
    enum: ['BOSS', 'ITEM', 'SALE'],
  },
  previous: {
    type: String,
  },
  new: {
    type: String,
  },
}, {
  versionKey: false,
});

module.exports = Notification.discriminator('DropNotification', DropNotificationSchema, 'drop');
