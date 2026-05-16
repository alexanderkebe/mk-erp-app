const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();

// Helper to generate JWT
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

// ── POST /api/auth/register ────────────────────────────────────────────────
router.post('/register', async (req, res) => {
  try {
    const { fullName, username, password, phone, category, subRole, region, position } = req.body;

    // Validate required fields
    if (!fullName || !username || !password || !phone || !category) {
      return res.status(400).json({ message: 'Please provide all required fields.' });
    }

    // Check if username already taken
    const existing = await User.findOne({ username: username.toLowerCase() });
    if (existing) {
      return res.status(409).json({ message: 'Username already taken. Please choose another.' });
    }

    // Create user (password hashed via pre-save hook)
    const user = await User.create({
      fullName,
      username,
      password,
      phone,
      category,
      subRole: subRole || '',
      region: region || '',
      position: position || 'member',
    });

    const token = generateToken(user._id);

    res.status(201).json({
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        username: user.username,
        category: user.category,
        subRole: user.subRole,
        region: user.region,
        position: user.position,
        initials: user.fullName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase(),
      },
    });
  } catch (err) {
    console.error('Register error:', err.message);
    if (err.name === 'ValidationError') {
      const message = Object.values(err.errors).map(val => val.message);
      return res.status(400).json({ message: message[0] });
    }
    res.status(500).json({ message: 'Server error during registration.' });
  }
});

// ── POST /api/auth/login ───────────────────────────────────────────────────
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: 'Please provide username and password.' });
    }

    // Find user
    const user = await User.findOne({ username: username.toLowerCase() });
    if (!user) {
      return res.status(401).json({ message: 'Invalid username or password.' });
    }

    // Check password
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid username or password.' });
    }

    const token = generateToken(user._id);

    res.json({
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        username: user.username,
        category: user.category,
        subRole: user.subRole,
        region: user.region,
        position: user.position,
        initials: user.fullName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase(),
      },
    });
  } catch (err) {
    console.error('Login error:', err.message);
    res.status(500).json({ message: 'Server error during login.' });
  }
});

module.exports = router;
