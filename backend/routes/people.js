// routes/People.js
const express = require('express');
const router = express.Router();
const People = require('../models/People'); // Your mongoose People model

// Get all people
router.get('/', async (req, res) => {
  try {
    const people = await People.find({});
    res.json(people);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching people' });
  }
});

// Add a new person
router.post('/', async (req, res) => {
  const { email } = req.body;
  try {
    // Check if email already exists
    const existingPerson = await People.findOne({ email });
    if (existingPerson) return res.status(400).json({ error: 'Email already exists' });

    // Save new person
    const person = new People({ email });
    await person.save();
    res.json(person);
  } catch (error) {
    res.status(500).json({ error: 'Error saving person' });
  }
});

module.exports = router;
