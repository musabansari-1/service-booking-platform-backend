const express = require('express');
const jwt = require('jsonwebtoken');

const router = express.Router();

const {register,login} = require('../controllers/authController');

router.post('/register', register);
router.post('/login', login);

router.get('/me', (req, res) => {
    const authHeader = req.headers.authorization;
  
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ user: null, message: 'No token provided' });
    }
  
    const token = authHeader.split(' ')[1];

    console.log("JWT_SECRET:", process.env.JWT_SECRET);

  
    // try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log('decoded', decoded);
      return res.json({ user: decoded }); // optionally only send user id/email
    // } catch (err) {
    //   return res.status(401).json({ user: null, message: 'Invalid token' });
    // }
  });


module.exports = router;