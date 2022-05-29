const mongoose = require('mongoose');
const Notification = require('./Notification');

const PartyNotificationSchema = new mongoose.Schema({
  partyId: {
    type: mongoose.ObjectId,
    required: true,
  },
  content: {
    type: {
      type: String,
      enum: ['NAME', 'MEMBERS'],
    },
    value: String,
  },
}, {
  versionKey: false,
});

module.exports = Notification.discriminator('PartyNotification', PartyNotificationSchema, 'PARTY');
