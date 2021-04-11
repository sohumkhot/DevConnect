const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = function (req, res, next) {
  // Get token from header with key x-auth-token
  token = req.header('x-auth-token');

  // Return 401 Unauthorized if no token found
  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  // Verify the token if token is present
  try {
    const decoded = jwt.verify(token, config.get('jwtSecret'));
    req.user = jwt.user;
    next();
  } catch (err) {
    return res.status(401).json({ msg: 'Token is not valid' });
  }
};
