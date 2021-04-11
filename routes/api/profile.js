const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');

// Import Profile and User models
const Profile = require('../../models/Profile');
const User = require('../../models/User');

// @route   GETapi/profile
// @desc    Test route
// @access  Public
router.get('/me', auth, async (req, res) => {
  try {
    // Find profile by user.id from auth and popuplate it with name and avatar from user with same id
    const profile = await Profile.findOne({
      user: req.user.id,
    }).populate('user', ['name', 'avatar']);

    // If profile doesnt exist, throw 400
    if (!profile) {
      return res.status(400).json({ msg: 'There is no profile for this user' });
    }

    // If profile exists, return profile
    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
