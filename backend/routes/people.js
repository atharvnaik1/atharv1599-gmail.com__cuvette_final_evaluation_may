const express = require('express');
const auth = require('../utils/auth'); // JWT authentication middleware
const router = express.Router();

let people = []; // In-memory storage, replace with database in production

// GET /api/people - Get all people
router.get('/', auth, (req, res) => {
  res.json(people);
});

// POST /api/people - Add a new person
router.post('/', auth, (req, res) => {
  const { email } = req.body;

  if (people.includes(email)) {
    return res.status(400).json({ msg: 'Email already exists' });
  }

  people.push(email);
  res.status(201).json({ msg: 'Email added successfully' });
});

module.exports = router;
