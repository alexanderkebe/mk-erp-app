const express = require('express');
const User = require('../models/User');
const router = express.Router();

// GET /api/users - Get all users
router.get('/', async (req, res) => {
  try {
    const users = await User.find({}, '-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    console.error('Fetch users error:', err.message);
    res.status(500).json({ message: 'Server error while fetching users.' });
  }
});

module.exports = router;
