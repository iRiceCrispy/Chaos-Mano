const mongoose = require('mongoose');
const Notification = require('./Notification');

const PartyNotificationSchema = new mongoose.Schema({
  partyId: {
    type: mongoose.ObjectId,
    required: true,
  },
  content: {
    type: String,
    enum: ['NAME', 'MEMBERS'],
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

module.exports = Notification.discriminator('PartyNotification', PartyNotificationSchema, 'party');
