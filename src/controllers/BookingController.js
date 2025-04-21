const Booking = require("../models/Booking");

exports.bookService = async (req,res,next) => {
    const {serviceId, userId, slotId} = req.body;

    const newBooking = await new Booking({
        serviceId,
        userId,
        slotId,
    })

    try {
        const savedBooking = await newBooking.save();
        res.status(201).json(savedBooking);
      } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
      }
}