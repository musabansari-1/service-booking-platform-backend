// middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {

  console.log("req.header('Authorization')",req.header('Authorization'))

  const token = req.header('Authorization')?.replace('Bearer ', '');

  console.log('token', token);

  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  // try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);  // Verify the token
    req.user = await User.findById(decoded.id).select('-password');  // Get user from DB
    next();  // Continue to the next middleware/route handler
  // } catch (err) {
  //   res.status(401).json({ message: 'Invalid token' });  // Handle invalid token
  // }
};

module.exports = auth;
