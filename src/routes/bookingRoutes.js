const express = require('express');

const router = express.Router();

const {bookService, getBookingByUserId, deleteBooking} = require('../controllers/BookingController');

router.delete('/:id', deleteBooking)

router.get('/:userId', getBookingByUserId);


router.post('/', bookService);





module.exports = router;