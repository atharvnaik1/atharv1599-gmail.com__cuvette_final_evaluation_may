// models/People.js
const mongoose = require('mongoose');

const PeopleSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    validate: {
      validator: function (email) {
        // Simple email validation regex
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
      },
      message: props => `${props.value} is not a valid email!`
    }
  },
}, { timestamps: true });

module.exports = mongoose.model('People', PeopleSchema);
