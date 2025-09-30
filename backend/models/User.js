const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    minlength: 3,
    maxlength: 30
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  firstName: {
    type: String,
    required: true,
    maxlength: 50
  },
  lastName: {
    type: String,
    required: true,
    maxlength: 50
  },
  phoneNumber: {
    type: String,
    maxlength: 16  // +7(123)456-78-90
  },
  passportNumber: {
    type: String,
    maxlength: 12  // 12 34 567890
  },
  bankCardNumber: {
    type: String,
    maxlength: 19  // 1234 5678 9012 3456
  },
  deliveryAddress: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
})

module.exports = mongoose.model('User', userSchema)