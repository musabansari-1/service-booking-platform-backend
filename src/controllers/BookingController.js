const Booking = require("../models/Booking");
const Service = require("../models/Service");

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


exports.getBookingByUserId = async (req, res, next) => {
  console.log('Inside here');
  // try {
    const userId = req.params.userId;

    console.log('userId', userId);

    // Find bookings for the given userId
    const bookings = await Booking.find({ userId: userId }).populate('slotId').populate({
    path: 'serviceId',
    populate: {
      path: 'providerId',
      model: 'User'
    }
  });

  const service = await Service.findOne().populate('providerId');
  console.log('service ', service);
    

    // console.log('bookings ');
    // console.log(bookings);

    if (!bookings) {
      return res.status(404).json({ message: 'No bookings found for this user' });
    }

    // Send back bookings data
    res.status(200).json(bookings);
  // } catch (error) {
  //   console.error('Error fetching bookings:', error);
  //   res.status(500).json({ message: 'Server error fetching bookings' });
  // }
};

exports.deleteBooking = async (req,res,next) => {
  console.log('Inside delete booking');
  const bookingId = req.params.id;
  const booking = await Booking.findById(bookingId);

  if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
  }

  await Booking.deleteOne({_id: bookingId});

  return res.status(200).json({message: "Booking deleted Successfully"});

}