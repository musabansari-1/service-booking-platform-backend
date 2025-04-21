const mongoose = require('mongoose');

const ServiceSchema = new mongoose.Schema({
    providerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        // required: true,
    },
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    imagePath: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    duration: {
        type: Number,
        required: true,
    },
    availability: {
        Monday: { 
          isOff: { type: Boolean, default: false }, 
          startTime: { type: String, default: '' }, 
          endTime: { type: String, default: '' } 
        },
        Tuesday: { 
          isOff: { type: Boolean, default: false }, 
          startTime: { type: String, default: '' }, 
          endTime: { type: String, default: '' } 
        },
        Wednesday: { 
          isOff: { type: Boolean, default: false }, 
          startTime: { type: String, default: '' }, 
          endTime: { type: String, default: '' } 
        },
        Thursday: { 
          isOff: { type: Boolean, default: false }, 
          startTime: { type: String, default: '' }, 
          endTime: { type: String, default: '' } 
        },
        Friday: { 
          isOff: { type: Boolean, default: false }, 
          startTime: { type: String, default: '' }, 
          endTime: { type: String, default: '' } 
        },
        Saturday: { 
          isOff: { type: Boolean, default: false }, 
          startTime: { type: String, default: '' }, 
          endTime: { type: String, default: '' } 
        },
        Sunday: { 
          isOff: { type: Boolean, default: false }, 
          startTime: { type: String, default: '' }, 
          endTime: { type: String, default: '' } 
        }
      },
});

module.exports = mongoose.model('Service', ServiceSchema);
