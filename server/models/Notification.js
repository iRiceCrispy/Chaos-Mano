const mongoose = require('mongoose');

const receiverSchema = new mongoose.Schema({
  userId: {
    type: mongoose.ObjectId,
    required: true,
  },
  hasRead: {
    type: Boolean,
    default: false,
  },
}, {
  _id: false,
});

const notificationSchema = new mongoose.Schema({
  action: {
    type: String,
    enum: ['CREATE', 'UPDATE', 'DELETE'],
    required: true,
    default: 'CREATE',
  },
  senderId: {
    type: mongoose.ObjectId,
    required: true,
  },
  receivers: [receiverSchema],
}, {
  discriminatorKey: 'type',
  timestamps: {
    createdAt: true,
    updatedAt: false,
  },
  versionKey: false,
});

module.exports = mongoose.model('Notification', notificationSchema);
