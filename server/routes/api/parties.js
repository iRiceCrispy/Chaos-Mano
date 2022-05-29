const express = require('express');
const asyncHandler = require('express-async-handler');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { requireAuth, unauthorizedError } = require('../../utils/auth');
const { Party, Drop } = require('../../models');

const router = express.Router();

router.use(requireAuth);

const validateParty = [
  check('name')
    .exists({ checkFalsy: true })
    .withMessage('Please provide a value for name.')
    .bail()
    .isLength({ min: 3 })
    .withMessage('Name must be at least 3 characters long.')
    .isLength({ max: 25 })
    .withMessage('Name cannot be longer than 25 characters.'),
  check('memberIds')
    .isArray({ min: 2 })
    .withMessage('Please include at least 2 members in the party, including yourself.'),
  handleValidationErrors,
];

const validateDrop = [
  check('bossName')
    .exists({ checkFalsy: true })
    .withMessage('Please enter a boss.'),
  check('itemName')
    .exists({ checkFalsy: true })
    .withMessage('Please enter an item.'),
  check('image')
    .custom((image) => {
      if (!image.length || image.endsWith('.jpg') || image.endsWith('.jpeg') || image.endsWith('.png')) {
        return true;
      }

      throw new Error('Only images with extentions .png, .jpg, and .jpeg are accepted.');
    }),
  check('memberIds')
    .isArray({ min: 2 })
    .withMessage('Please include at least 2 members in the party, including yourself.')
    .isArray({ max: 6 })
    .withMessage('There cannot be more than 6 members in a party.'),
  handleValidationErrors,
];

// Get all parties that the current user belongs to
router.get('/', asyncHandler(async (req, res) => {
  const { user } = req;

  const parties = await Party.find({ memberIds: user.id });

  res.json(parties);
}));

// Create a new party, making the current user as party leader automatically
router.post('/', validateParty, asyncHandler(async (req, res) => {
  const { user, sockets } = req;
  const { name, memberIds } = req.body;

  const party = await Party.create({ name, leaderId: user.id, memberIds });
  const data = await Party.findById(party.id);

  const socket = sockets[user.id];
  const socketsInParty = [];

  Object.values(sockets).forEach((s) => {
    if (memberIds.includes(s.userId)) socketsInParty.push(s);
  });

  socketsInParty.forEach((s) => {
    s.join(party.id);
  });

  socket.to(party.id).emit('updateParties');

  await party.createNotification();

  res.json(data);
}));

// Update a party
router.put('/:id', validateParty, asyncHandler(async (req, res, next) => {
  const { user, sockets } = req;
  const { id } = req.params;
  const { name, memberIds } = req.body;

  const party = await Party.findById(id);

  if (party.leaderId.toString() !== user.id) return next(unauthorizedError);

  party.name = name;
  party.memberIds = memberIds;

  await party.save();

  const socket = sockets[user.id];
  socket.to(party.id).emit('updateParties');

  await party.createNotification('update');

  res.json(party);
}));

// Delete a party
router.delete('/:id', asyncHandler(async (req, res, next) => {
  const { user, sockets } = req;
  const { id } = req.params;

  const party = await Party.findById(id);

  if (party.leaderId.toString() !== user.id) return next(unauthorizedError);

  await party.remove();

  const socket = sockets[user.id];
  socket.to(party.id).emit('updateParties');

  await party.createNotification('delete');

  res.json(party);
}));

// Create a new drop for a party
router.post('/:id/drops', validateDrop, asyncHandler(async (req, res, next) => {
  const { user, sockets } = req;
  const { id } = req.params;
  const {
    bossName,
    itemName,
    image,
    memberIds,
  } = req.body;

  const party = await Party.findById(id);

  if (party.leaderId.toString() !== user.id) return next(unauthorizedError);

  const drop = await Drop.create({
    partyId: party.id,
    bossName,
    itemName,
    image,
    members: memberIds.map(memberId => ({ userId: memberId })),
  });
  const data = await Drop.findById(drop.id);

  const socket = sockets[user.id];
  socket.to(data.party.id).emit('updateDrops');

  res.json(data);
}));

module.exports = router;
