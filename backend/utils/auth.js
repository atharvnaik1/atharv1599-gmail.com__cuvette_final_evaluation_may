const jwt = require('jsonwebtoken');
require('dotenv').config();
const User = require('../models/User'); // Adjust the path to your User model

const auth = async (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1]; // Bearer <token>
  if (!token) return res.status(401).json({ msg: 'No token, authorization denied' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Ensure you use the same secret as during token generation
    req.user = decoded.id; 

    // Fetch the user by ID to get the username
    const user = await User.findById(decoded.id);
    if (!user) return res.status(404).json({ msg: 'User not found' });

    req.username = user.name; 
    req.email = user.email;
    next();

  } catch (error) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
};

module.exports = auth;
