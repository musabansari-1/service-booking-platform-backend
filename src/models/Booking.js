const mongoose = require('mongoose');
const { Schema } = mongoose;

const bookingSchema = new Schema({
  serviceId: {
    type: Schema.Types.ObjectId,
    ref: 'Service',
    required: true
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  // date: {
  //   type: Date,
  //   required: true
  // },
  // time: {
  //   type: String,
  //   required: true
  // },
  // timeZone: {
  //   type: String,
  //   required: true
  // },
  slotId: {
    type: Schema.Types.ObjectId,
    ref: 'Slot',
    required: true
  },

  status: {
    type: String,
    enum: ['confirmed', 'canceled', 'pending'],
    default: 'pending'
  }
}, {
  timestamps: true // Automatically add createdAt and updatedAt fields
});

const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;
