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
  toJSON: {
    virtuals: true,
    transform(doc, ret) {
      return {
        id: ret.id,
        type: ret.type,
        senderId: ret.senderId,
        partyId: ret.partyId,
        action: ret.action,
        content: ret.content,
        receivers: ret.receivers,
        createdAt: ret.createdAt,
      };
    },
  },
});

module.exports = Notification.discriminator('PartyNotification', PartyNotificationSchema, 'PARTY');
