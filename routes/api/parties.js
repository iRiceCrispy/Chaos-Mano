const express = require('express');
const asyncHandler = require('express-async-handler');
const { requireAuth, unauthorizedError } = require('../../utils/auth');
const { Party } = require('../../db/models');

const router = express.Router();

router.use(requireAuth);

router.get('/', asyncHandler(async (req, res) => {
  const { user } = req;

  const parties = await Party.find({ members: { $in: user.id } });

  res.json(parties);
}));

router.post('/', asyncHandler(async (req, res) => {
  const { user } = req;
  const { name, memberIds } = req.body;

  const party = await Party.create({ name, leaderId: user.id, members: memberIds });

  res.json(party);
}));

router.put('/:id', asyncHandler(async (req, res, next) => {
  const { user } = req;
  const { id } = req.params;
  const { name, memberIds } = req.body;

  const party = await Party.findOne({ id });

  if (party.leaderId !== user.id) return next(unauthorizedError);

  if (name) party.name = name;
  if (memberIds) party.members = memberIds;

  res.json(party);
}));

router.delete('/:id', asyncHandler(async (req, res, next) => {
  const { user } = req;
  const { id } = req.params;

  const party = await Party.findOne({ id });

  if (party.leaderId !== user.id) return next(unauthorizedError);

  await Party.deleteOne({ id });

  res.json(party);
}));

router.post('/:id/members', asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { memberId } = req.body;

  const party = await Party.findOne({ id });

  party.members.push(memberId);

  await party.save();

  res.json(party);
}));

router.delete('/:partyId/members/:memberId', asyncHandler(async (req, res) => {
  const { partyId, memberId } = req.params;

  const party = await Party.findOne({ id: partyId });

  party.members.pull(memberId);

  await party.save();

  res.json(party);
}));

module.exports = router;
