const mongoose = require('mongoose');

const SlotSchema = new mongoose.Schema({
    serviceId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Service', 
      // required: true 
    },
    date: { 
      type: Date, 
      required: true 
    },
    startTime: { 
      type: String, 
      required: true 
    },
    endTime: { 
      type: String, 
      required: true 
    },
    isBooked: { 
      type: Boolean, 
      default: false 
    },
    bookedBy: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User' 
    }
  });
  
  module.exports = mongoose.model('Slot', SlotSchema);
