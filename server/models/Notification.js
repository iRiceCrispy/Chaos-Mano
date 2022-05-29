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
});

const notificationSchema = new mongoose.Schema({
  senderId: {
    type: mongoose.ObjectId,
    required: true,
  },
  receivers: [receiverSchema],
  action: {
    type: String,
    enum: ['CREATE', 'UPDATE', 'DELETE'],
    required: true,
    default: 'CREATE',
  },
}, {
  timestamps: {
    createdAt: true,
  },
  versionKey: false,
});

module.exports = mongoose.model('Notification', notificationSchema);
