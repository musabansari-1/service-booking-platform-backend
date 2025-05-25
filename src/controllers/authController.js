// routes/auth.js
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { signToken, verifyToken } = require('../utils/jwt');  // Import JWT functions

// **Register route (sign up)**

exports.register = async (req, res) => {
    const {username, email, password, type } = req.body;
  
    try {
      // Check if the email already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: 'Email already exists' });
      }
  
      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);
  
      // Create a new user
      const newUser = new User({
        email,
        password: hashedPassword,
        username,
        type
      });
  
      // Save the new user to the database
      await newUser.save();
  
      // Generate JWT token for the new user
      const token = signToken(newUser._id);
  
      // Send the token to the client
      res.status(201).json({ token });
  
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error' });
    }
  }


// **Login route**

exports.login = async (req, res) => {
    const { email, password } = req.body;
  
    try {
      // Find the user by email
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }
  
      // Compare the provided password with the hashed password in the database
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }
  
      // Generate a JWT token for the logged-in user
      const token = signToken(user._id);
  
      // Send the token to the client
      res.json({ token });
  
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error' });
    }
  }


