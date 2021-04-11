const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const { check, validationResult } = require('express-validator/check');

// Import User model
const User = require('../../models/User');

// @route   GETapi/users
// @desc    Test route
// @access  Public
router.post(
  '/',
  [
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check(
      'password',
      'Please enter a password with 6 or more characters'
    ).isLength({ min: 6 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    console.log(req.body);
    const { name, email, password } = req.body;

    try {
      // Check if user exists: if yes, throw 400
      let user = await User.findOne({ email });
      if (user) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'User already exists' }] });
      }

      // Fetch gravatar URL by email of the user
      const avatar = gravatar.url(email, {
        // s: resizing pixel size
        s: '200',
        // r: only 'pg' rated images will be fetched
        r: 'pg',
        // d: can be '404' for not found but assigned 'mm' for a default pic
        d: 'mm',
      });

      // Create a new user with the imported 'User' model
      user = new User({
        name,
        email,
        avatar,
        password,
      });

      // Generate salt for hashing from bcryptjs
      const salt = await bcrypt.genSalt(10);

      // Hash the plaintext password using the above generated salt
      user.password = await bcrypt.hash(password, salt);

      // Save the user to MongoDB, returns a promise
      await user.save();

      res.send('User registered');
    } catch (err) {
      res.status(500).send('Server Error');
    }
  }
);

module.exports = router;
