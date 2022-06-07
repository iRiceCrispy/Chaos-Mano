const mongoose = require('mongoose');
const autopopulate = require('mongoose-autopopulate');

const partySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  leaderId: {
    type: mongoose.ObjectId,
    required: true,
  },
  memberIds: [{
    type: mongoose.ObjectId,
  }],
}, {
  timestamps: true,
  versionKey: false,
  toJSON: {
    virtuals: true,
    transform(doc, ret) {
      return {
        id: ret.id,
        name: ret.name,
        leader: ret.leader,
        members: ret.members,
      };
    },
  },
});

partySchema.post('save', async (doc, next) => {
  await doc.populate('members');

  return next();
});

partySchema.pre('remove', async function remove(next) {
  await mongoose.models.Drop.deleteMany({ partyId: this.id });

  return next();
});

partySchema.virtual('leader', {
  ref: 'User',
  localField: 'leaderId',
  foreignField: '_id',
  justOne: true,
  autopopulate: true,
});

partySchema.virtual('members', {
  ref: 'User',
  localField: 'memberIds',
  foreignField: '_id',
  autopopulate: true,
});

partySchema.methods.createNotification = async function createNotification(type = 'create') {
  const notification = new mongoose.models.PartyNotification({
    senderId: this.leaderId,
    receivers: this.memberIds
      .filter(memberId => !memberId.equals(this.leaderId))
      .map(memberId => ({ userId: memberId })),
    partyId: this.id,
  });

  if (type === 'update') {
    notification.action = 'UPDATE';
    notification.content = {
      type: 'NAME',
      value: this.name,
    };
  }
  else if (type === 'delete') {
    notification.action = 'DELETE';
    notification.content = {
      type: 'NAME',
      value: this.name,
    };
  }
  else {
    notification.action = 'CREATE';
    notification.content = {
      type: 'NAME',
      value: this.name,
    };
  }

  await notification.save();

  return notification;
};

partySchema.plugin(autopopulate);

module.exports = mongoose.model('Party', partySchema);
