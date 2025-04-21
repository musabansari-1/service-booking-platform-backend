const express = require('express');

const router = express.Router();

const {bookService} = require('../controllers/BookingController');


router.post('/', bookService);


module.exports = router;