const express = require('express');
const multer = require('multer');
const Service = require('../models/Service');
const path = require('path');
const fs = require('fs');
const Slot = require('../models/Slot');
const auth = require('../middlewares/auth');

const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/serviceImages');
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const convertToMinutes = (timeStr) => {
  const [hours, minutes] = timeStr.split(':').map(Number);
  return hours * 60 + minutes;
}

const addMinutesToTime = (time, minutesToAdd) => {
  // Split the time string into hours and minutes
  let [hours, minutes] = time.split(':').map(Number);

  updatedMinutes = minutes + parseInt(minutesToAdd);
  updatedHours = hours;
  while(updatedMinutes > 60) {
    updatedMinutes -= 60;
    updatedHours += 1;
  }
  return `${updatedHours}:${updatedMinutes}`;
}

const generateSlots = async (serviceId, availability, duration) => {
  console.log('inside generateSlots')
  const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const currentDate = new Date();
  for (let i = 0; i < 10; i++) {
    const day = daysOfWeek[currentDate.getDay()];
    console.log('day',day);
    console.log("availability.day", availability[day]);
    console.log('ada',availability[day].isOff)
    if(availability[day].isOff == true) {
      console.log('inside here');
      currentDate.setDate(currentDate.getDate() + 1);
      continue;
    }
    let start = availability[day].startTime;
    const end = availability[day].endTime;
    while((convertToMinutes(start) + parseInt(duration)) <= convertToMinutes(end)) {
      const endTime = addMinutesToTime(start,duration);
      console.log('start',start);
      console.log('end',end);
      console.log('duration',duration);
      console.log('endTime', endTime);
      const slot = new Slot({
        serviceId: serviceId,
        date: currentDate,
        startTime: start,
        endTime: endTime,
      })
      const savedSlot = await slot.save();
      console.log('savedSlot', savedSlot);
      start = endTime;
    }
    currentDate.setDate(currentDate.getDate() + 1);
  }
}

const upload = multer({ storage });

// Route to create a new service
router.post('/', upload.single('image'), async (req, res) => {
  console.log('Inside this endpoint');
  const { name, description, price, duration, availability } = req.body;

  console.log('wanted');
  console.log('availability', JSON.parse(availability));
  const { file } = req;

  if (!file) {
    return res.status(400).json({ message: 'No image uploaded' });
  }

  const newService = new Service({
    name,
    description,
    imagePath: file.path,
    price,
    duration,
    availability: JSON.parse(availability),
  });

  

  try {
    const savedService = await newService.save();
    console.log('service___id', savedService._id);
    await generateSlots(savedService._id, JSON.parse(availability), duration)
    res.status(201).json(savedService);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

router.put('/:id', auth,  upload.single('image'), async (req, res) => {
  const { id } = req.params;
  const { name, description, price, duration } = req.body;
  const { file } = req;

  if (!file) {
    return res.status(400).json({ message: 'No image uploaded' });
  }

  const updatedService = {
    name,
    description,
    imagePath: file.path,
    price,
    duration
  }

  try {
    const service = await Service.findByIdAndUpdate(id, updatedService, { new: true, runValidators: true });

    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    res.status(200).json(service);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});



// Route to delete a specific service by ID
router.delete('/:id',   async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);

    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    // Remove the image file from the file system
    fs.unlink(service.imagePath, (err) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: 'Failed to delete image file' });
      }

      console.log('Image file deleted');
    });

    // Remove the service from the database
    await service.deleteOne({ "_id": req.params.id });;

    res.status(200).json({ message: 'Service deleted successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});




// Route to get all services
router.get('/', async (req, res) => {
  try {
    const services = await Service.find();
    res.status(200).json(services);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Route to get a specific service by ID
router.get('/:id',  async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);

    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    res.status(200).json(service);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

router.post('/slots',auth,  async (req,res) => {
  const {serviceId} = req.body;
  const slots = await Slot.find({
    serviceId: serviceId,
     isBooked: false,
  })
  if (slots.length == 0) {
    return res.json({message: 'No slots found'});
  }
  return res.json(slots);
})





// Route to serve the image file
router.get('/images/:filename', (req, res) => {
  const filePath = path.join(__dirname, '..', 'uploads', req.params.filename);
  res.sendFile(filePath);
});

module.exports = router;
