// const express = require('express');
// const multer = require('multer');
// const Service = require('../models/Service');
// const path = require('path');
// const fs = require('fs');
// const Slot = require('../models/Slot');
// const auth = require('../middlewares/auth');

// const router = express.Router();

// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, 'uploads/serviceImages');
//   },
//   filename: function (req, file, cb) {
//     cb(null, `${Date.now()}-${file.originalname}`);
//   },
// });

// const convertToMinutes = (timeStr) => {
//   const [hours, minutes] = timeStr.split(':').map(Number);
//   return hours * 60 + minutes;
// }

// const addMinutesToTime = (time, minutesToAdd) => {
//   // Split the time string into hours and minutes
//   let [hours, minutes] = time.split(':').map(Number);

//   updatedMinutes = minutes + parseInt(minutesToAdd);
//   updatedHours = hours;
//   while(updatedMinutes > 60) {
//     updatedMinutes -= 60;
//     updatedHours += 1;
//   }
//   return `${updatedHours}:${updatedMinutes}`;
// }

// // const generateSlots = async (serviceId, availability, duration) => {
// //   console.log('inside generateSlots')
// //   const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
// //   const currentDate = new Date();
// //   for (let i = 0; i < 10; i++) {
// //     const day = daysOfWeek[currentDate.getDay()];
// //     console.log('day',day);
// //     console.log("availability.day", availability[day]);
// //     console.log('ada',availability[day].isOff)
// //     if(availability[day].isOff == true) {
// //       console.log('inside here');
// //       currentDate.setDate(currentDate.getDate() + 1);
// //       continue;
// //     }
// //     let start = availability[day].startTime;
// //     const end = availability[day].endTime;
// //     while((convertToMinutes(start) + parseInt(duration)) <= convertToMinutes(end)) {
// //       const endTime = addMinutesToTime(start,duration);
// //       console.log('start',start);
// //       console.log('end',end);
// //       console.log('duration',duration);
// //       console.log('endTime', endTime);
// //       const slot = new Slot({
// //         serviceId: serviceId,
// //         date: currentDate,
// //         startTime: start,
// //         endTime: endTime,
// //       })
// //       const savedSlot = await slot.save();
// //       console.log('savedSlot', savedSlot);
// //       start = endTime;
// //     }
// //     currentDate.setDate(currentDate.getDate() + 1);
// //   }
// // }

// const generateSlots = async (serviceId, availability, durationHours) => {
//   const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  
//   const totalSlotsDays = 30;  // Total number of days to generate slots for (excluding off days)
//   let generatedDaysCount = 0;  // Count of days slots have been generated for
//   let currentDate = new Date();

//   while (generatedDaysCount < totalSlotsDays) {
//     const day = daysOfWeek[currentDate.getDay()];
//     if (!availability[day] || availability[day].isOff) {
//       // If the day is off or no availability info, just move to next day
//       currentDate.setDate(currentDate.getDate() + 1);
//       continue;
//     }

//     let start = availability[day].startTime;
//     const end = availability[day].endTime;

//     // Convert duration from hours to minutes
//     const durationMinutes = parseInt(durationHours * 60);

//     // Generate slots for the current day
//     while ((convertToMinutes(start) + durationMinutes) <= convertToMinutes(end)) {
//       const endTime = addMinutesToTime(start, durationMinutes);

//       const slot = new Slot({
//         serviceId: serviceId,
//         date: new Date(currentDate),  // Make sure to create a new Date object
//         startTime: start,
//         endTime: endTime,
//       });

//       await slot.save();
//       start = endTime;
//     }

//     // Increment count after generating slots for this day
//     generatedDaysCount++;
//     // Move to next day
//     currentDate.setDate(currentDate.getDate() + 1);
//   }
// };


// const upload = multer({ storage });

// // Route to create a new service
// router.post('/', upload.single('image'), async (req, res) => {
//   console.log('Inside this endpoint');
//   const { name, description, price, duration, availability } = req.body;

//   console.log('wanted');
//   console.log('availability', JSON.parse(availability));
//   const { file } = req;

//   if (!file) {
//     return res.status(400).json({ message: 'No image uploaded' });
//   }

//   const newService = new Service({
//     name,
//     description,
//     imagePath: file.path,
//     price,
//     duration,
//     availability: JSON.parse(availability),
//   });

  

//   try {
//     const savedService = await newService.save();
//     console.log('service___id', savedService._id);
//     await generateSlots(savedService._id, JSON.parse(availability), duration)
//     res.status(201).json(savedService);
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).send('Server error');
//   }
// });

// router.put('/:id', auth,  upload.single('image'), async (req, res) => {
//   const { id } = req.params;
//   const { name, description, price, duration } = req.body;
//   const { file } = req;

//   if (!file) {
//     return res.status(400).json({ message: 'No image uploaded' });
//   }

//   const updatedService = {
//     name,
//     description,
//     imagePath: file.path,
//     price,
//     duration
//   }

//   try {
//     const service = await Service.findByIdAndUpdate(id, updatedService, { new: true, runValidators: true });

//     if (!service) {
//       return res.status(404).json({ message: 'Service not found' });
//     }

//     res.status(200).json(service);
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).send('Server error');
//   }
// });



// // Route to delete a specific service by ID
// router.delete('/:id',   async (req, res) => {
//   try {
//     const service = await Service.findById(req.params.id);

//     if (!service) {
//       return res.status(404).json({ message: 'Service not found' });
//     }

//     // Remove the image file from the file system
//     fs.unlink(service.imagePath, (err) => {
//       if (err) {
//         console.error(err);
//         return res.status(500).json({ message: 'Failed to delete image file' });
//       }

//       console.log('Image file deleted');
//     });

//     // Remove the service from the database
//     await service.deleteOne({ "_id": req.params.id });

//     res.status(200).json({ message: 'Service deleted successfully' });
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).send('Server error');
//   }
// });




// // Route to get all services
// router.get('/', async (req, res) => {
//   try {
//     const services = await Service.find();
//     res.status(200).json(services);
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).send('Server error');
//   }
// });

// // Route to get a specific service by ID
// router.get('/:id',  async (req, res) => {
//   try {
//     const service = await Service.findById(req.params.id);

//     if (!service) {
//       return res.status(404).json({ message: 'Service not found' });
//     }

//     res.status(200).json(service);
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).send('Server error');
//   }
// });

// router.post('/slots',auth,  async (req,res) => {
//   const {serviceId} = req.body;
//   const slots = await Slot.find({
//     serviceId: serviceId,
//      isBooked: false,
//   })
//   if (slots.length == 0) {
//     return res.json({message: 'No slots found'});
//   }
//   return res.json(slots);
// })





// // // Route to serve the image file
// // router.get('/images/:filename', (req, res) => {
// //   const filePath = path.join(__dirname, '..', 'uploads', req.params.filename);
// //   res.sendFile(filePath);
// // });

// module.exports = router;



// const express = require('express');
// const multer = require('multer');
// const Service = require('../models/Service');
// const path = require('path');
// const fs = require('fs');
// const Slot = require('../models/Slot');
// const auth = require('../middlewares/auth');

// const router = express.Router();

// // ✅ Ensure uploads/serviceImages folder exists
// const uploadDir = path.join(__dirname, '..', 'uploads', 'serviceImages');
// fs.mkdirSync(uploadDir, { recursive: true });  // Safe to call even if it already exists

// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, uploadDir); // Use the ensured folder
//   },
//   filename: function (req, file, cb) {
//     cb(null, `${Date.now()}-${file.originalname}`);
//   },
// });

// const convertToMinutes = (timeStr) => {
//   const [hours, minutes] = timeStr.split(':').map(Number);
//   return hours * 60 + minutes;
// }

// const addMinutesToTime = (time, minutesToAdd) => {
//   let [hours, minutes] = time.split(':').map(Number);
//   let updatedMinutes = minutes + parseInt(minutesToAdd);
//   let updatedHours = hours;
//   while (updatedMinutes >= 60) {
//     updatedMinutes -= 60;
//     updatedHours += 1;
//   }
//   return `${String(updatedHours).padStart(2, '0')}:${String(updatedMinutes).padStart(2, '0')}`;
// }

// const generateSlots = async (serviceId, availability, durationHours) => {
//   const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
//   const totalSlotsDays = 30;
//   let generatedDaysCount = 0;
//   let currentDate = new Date();

//   while (generatedDaysCount < totalSlotsDays) {
//     const day = daysOfWeek[currentDate.getDay()];
//     if (!availability[day] || availability[day].isOff) {
//       currentDate.setDate(currentDate.getDate() + 1);
//       continue;
//     }

//     let start = availability[day].startTime;
//     const end = availability[day].endTime;
//     const durationMinutes = parseInt(durationHours * 60);

//     while ((convertToMinutes(start) + durationMinutes) <= convertToMinutes(end)) {
//       const endTime = addMinutesToTime(start, durationMinutes);

//       const slot = new Slot({
//         serviceId: serviceId,
//         date: new Date(currentDate),
//         startTime: start,
//         endTime: endTime,
//       });

//       await slot.save();
//       start = endTime;
//     }

//     generatedDaysCount++;
//     currentDate.setDate(currentDate.getDate() + 1);
//   }
// };

// const upload = multer({ storage });

// // Route to create a new service
// router.post('/', upload.single('image'), async (req, res) => {
//   const { name, description, price, duration, availability } = req.body;
//   const { file } = req;

//   if (!file) {
//     return res.status(400).json({ message: 'No image uploaded' });
//   }

//   const newService = new Service({
//     name,
//     description,
//     imagePath: file.path,
//     price,
//     duration,
//     availability: JSON.parse(availability),
//   });

//   try {
//     const savedService = await newService.save();
//     await generateSlots(savedService._id, JSON.parse(availability), duration);
//     res.status(201).json(savedService);
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).send('Server error');
//   }
// });

// router.put('/:id', auth, upload.single('image'), async (req, res) => {
//   const { id } = req.params;
//   const { name, description, price, duration } = req.body;
//   const { file } = req;

//   if (!file) {
//     return res.status(400).json({ message: 'No image uploaded' });
//   }

//   const updatedService = {
//     name,
//     description,
//     imagePath: file.path,
//     price,
//     duration
//   };

//   try {
//     const service = await Service.findByIdAndUpdate(id, updatedService, { new: true, runValidators: true });

//     if (!service) {
//       return res.status(404).json({ message: 'Service not found' });
//     }

//     res.status(200).json(service);
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).send('Server error');
//   }
// });

// router.delete('/:id', async (req, res) => {
//   try {
//     const service = await Service.findById(req.params.id);

//     if (!service) {
//       return res.status(404).json({ message: 'Service not found' });
//     }

//     fs.unlink(service.imagePath, (err) => {
//       if (err) {
//         console.error(err);
//         return res.status(500).json({ message: 'Failed to delete image file' });
//       }
//     });

//     await service.deleteOne({ "_id": req.params.id });

//     res.status(200).json({ message: 'Service deleted successfully' });
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).send('Server error');
//   }
// });

// router.get('/', async (req, res) => {
//   try {
//     const services = await Service.find();
//     res.status(200).json(services);
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).send('Server error');
//   }
// });

// router.get('/:id', async (req, res) => {
//   try {
//     const service = await Service.findById(req.params.id);

//     if (!service) {
//       return res.status(404).json({ message: 'Service not found' });
//     }

//     res.status(200).json(service);
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).send('Server error');
//   }
// });

// router.post('/slots', auth, async (req, res) => {
//   const { serviceId } = req.body;
//   const slots = await Slot.find({
//     serviceId: serviceId,
//     isBooked: false,
//   });

//   if (slots.length === 0) {
//     return res.json({ message: 'No slots found' });
//   }

//   return res.json(slots);
// });

// module.exports = router;



// const express = require('express');
// const multer = require('multer');
// const Service = require('../models/Service');
// const path = require('path');
// const fs = require('fs');
// const Slot = require('../models/Slot');
// const auth = require('../middlewares/auth');

// const router = express.Router();

// // Ensure uploads directory exists
// const uploadDir = path.join(__dirname, '..', 'uploads', 'serviceImages');
// if (!fs.existsSync(uploadDir)) {
//   fs.mkdirSync(uploadDir, { recursive: true });
//   console.log('📁 Created upload directory:', uploadDir);
// }

// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, 'uploads/serviceImages');
//   },
//   filename: function (req, file, cb) {
//     cb(null, `${Date.now()}-${file.originalname}`);
//   },
// });

// const upload = multer({ storage });

// const convertToMinutes = (timeStr) => {
//   const [hours, minutes] = timeStr.split(':').map(Number);
//   return hours * 60 + minutes;
// };

// const addMinutesToTime = (time, minutesToAdd) => {
//   let [hours, minutes] = time.split(':').map(Number);
//   let updatedMinutes = minutes + parseInt(minutesToAdd);
//   let updatedHours = hours;
//   while (updatedMinutes >= 60) {
//     updatedMinutes -= 60;
//     updatedHours += 1;
//   }
//   return `${updatedHours}:${updatedMinutes.toString().padStart(2, '0')}`;
// };

// const generateSlots = async (serviceId, availability, durationHours) => {
//   const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
//   const totalSlotsDays = 30;
//   let generatedDaysCount = 0;
//   let currentDate = new Date();

//   while (generatedDaysCount < totalSlotsDays) {
//     const day = daysOfWeek[currentDate.getDay()];
//     if (!availability[day] || availability[day].isOff) {
//       currentDate.setDate(currentDate.getDate() + 1);
//       continue;
//     }

//     let start = availability[day].startTime;
//     const end = availability[day].endTime;
//     const durationMinutes = parseInt(durationHours * 60);

//     while ((convertToMinutes(start) + durationMinutes) <= convertToMinutes(end)) {
//       const endTime = addMinutesToTime(start, durationMinutes);

//       const slot = new Slot({
//         serviceId: serviceId,
//         date: new Date(currentDate),
//         startTime: start,
//         endTime: endTime,
//       });

//       await slot.save();
//       start = endTime;
//     }

//     generatedDaysCount++;
//     currentDate.setDate(currentDate.getDate() + 1);
//   }
// };

// // ✅ POST route to create a new service
// router.post('/', upload.single('image'), async (req, res) => {
//   console.log('🚀 [POST /services] ➡️ Endpoint hit: Creating new service');

//   const { name, description, price, duration, availability } = req.body;
//   const { file } = req;

//   if (!file) {
//     console.log('❌ No image file uploaded');
//     return res.status(400).json({ message: 'No image uploaded' });
//   }

//   console.log(`✅ File uploaded: ${file.originalname}`);
//   console.log(`📂 Stored at: ${file.path}`);

//   // Check if file exists
//   fs.access(file.path, fs.constants.F_OK, (err) => {
//     if (err) {
//       console.error('❌ File does NOT exist at path:', file.path);
//     } else {
//       console.log('✅ Verified: File exists at path:', file.path);
//     }
//   });

//   const newService = new Service({
//     name,
//     description,
//     imagePath: file.path,
//     price,
//     duration,
//     availability: JSON.parse(availability),
//   });

//   try {
//     const savedService = await newService.save();
//     console.log('✅ Service saved to DB with ID:', savedService._id);
//     await generateSlots(savedService._id, JSON.parse(availability), duration);
//     res.status(201).json(savedService);
//   } catch (err) {
//     console.error('❌ Error saving service:', err.message);
//     res.status(500).send('Server error');
//   }
// });

// // ✅ PUT route to update a service
// router.put('/:id', auth, upload.single('image'), async (req, res) => {
//   console.log('🛠️ [PUT /services/:id] ➡️ Endpoint hit');

//   const { id } = req.params;
//   const { name, description, price, duration } = req.body;
//   const { file } = req;

//   if (!file) {
//     console.log('❌ No image file uploaded during update');
//     return res.status(400).json({ message: 'No image uploaded' });
//   }

//   console.log(`✅ File uploaded: ${file.originalname}`);
//   console.log(`📂 Stored at: ${file.path}`);

//   const updatedService = {
//     name,
//     description,
//     imagePath: file.path,
//     price,
//     duration,
//   };

//   try {
//     const service = await Service.findByIdAndUpdate(id, updatedService, { new: true, runValidators: true });

//     if (!service) {
//       return res.status(404).json({ message: 'Service not found' });
//     }

//     res.status(200).json(service);
//   } catch (err) {
//     console.error('❌ Error updating service:', err.message);
//     res.status(500).send('Server error');
//   }
// });

// // ✅ DELETE route to remove a service
// router.delete('/:id', async (req, res) => {
//   console.log('🗑️ [DELETE /services/:id] ➡️ Endpoint hit');

//   try {
//     const service = await Service.findById(req.params.id);

//     if (!service) {
//       return res.status(404).json({ message: 'Service not found' });
//     }

//     fs.unlink(service.imagePath, (err) => {
//       if (err) {
//         console.error('❌ Failed to delete image file:', err);
//       } else {
//         console.log('🗂️ Image file deleted');
//       }
//     });

//     await service.deleteOne({ _id: req.params.id });
//     res.status(200).json({ message: 'Service deleted successfully' });
//   } catch (err) {
//     console.error('❌ Error deleting service:', err.message);
//     res.status(500).send('Server error');
//   }
// });

// // ✅ Get all services
// router.get('/', async (req, res) => {
//   try {
//     const services = await Service.find();
//     res.status(200).json(services);
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).send('Server error');
//   }
// });

// // ✅ Get service by ID
// router.get('/:id', async (req, res) => {
//   try {
//     const service = await Service.findById(req.params.id);
//     if (!service) {
//       return res.status(404).json({ message: 'Service not found' });
//     }
//     res.status(200).json(service);
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).send('Server error');
//   }
// });

// // ✅ Get available slots for a service
// router.post('/slots', auth, async (req, res) => {
//   const { serviceId } = req.body;
//   try {
//     const slots = await Slot.find({
//       serviceId: serviceId,
//       isBooked: false,
//     });
//     if (slots.length === 0) {
//       return res.json({ message: 'No slots found' });
//     }
//     return res.json(slots);
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).send('Server error');
//   }
// });

// module.exports = router;


const express = require('express');
const multer = require('multer');
const { v2: cloudinary } = require('cloudinary');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const Service = require('../models/Service');
const Slot = require('../models/Slot');
const auth = require('../middlewares/auth');

// ✅ Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ✅ Cloudinary storage for multer
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'serviceImages',
    allowed_formats: ['jpg', 'jpeg', 'png'],
    transformation: [{ width: 800, height: 800, crop: 'limit' }],
  },
});

const upload = multer({ storage });

const router = express.Router();

const convertToMinutes = (timeStr) => {
  const [hours, minutes] = timeStr.split(':').map(Number);
  return hours * 60 + minutes;
};

const addMinutesToTime = (time, minutesToAdd) => {
  let [hours, minutes] = time.split(':').map(Number);
  let updatedMinutes = minutes + parseInt(minutesToAdd);
  let updatedHours = hours;
  while (updatedMinutes >= 60) {
    updatedMinutes -= 60;
    updatedHours += 1;
  }
  return `${updatedHours}:${updatedMinutes.toString().padStart(2, '0')}`;
};

const generateSlots = async (serviceId, availability, durationHours) => {
  const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const totalSlotsDays = 30;
  let generatedDaysCount = 0;
  let currentDate = new Date();

  while (generatedDaysCount < totalSlotsDays) {
    const day = daysOfWeek[currentDate.getDay()];
    if (!availability[day] || availability[day].isOff) {
      currentDate.setDate(currentDate.getDate() + 1);
      continue;
    }

    let start = availability[day].startTime;
    const end = availability[day].endTime;
    const durationMinutes = parseInt(durationHours * 60);

    while ((convertToMinutes(start) + durationMinutes) <= convertToMinutes(end)) {
      const endTime = addMinutesToTime(start, durationMinutes);

      const slot = new Slot({
        serviceId: serviceId,
        date: new Date(currentDate),
        startTime: start,
        endTime: endTime,
      });

      await slot.save();
      start = endTime;
    }

    generatedDaysCount++;
    currentDate.setDate(currentDate.getDate() + 1);
  }
};

// ✅ POST route to create a new service
router.post('/', upload.single('image'), async (req, res) => {
  console.log('🚀 [POST /services] ➡️ Endpoint hit: Creating new service');

  const { name, description, price, duration, availability } = req.body;
  const { file } = req;

  if (!file) {
    console.log('❌ No image file uploaded');
    return res.status(400).json({ message: 'No image uploaded' });
  }

  console.log(`✅ Image uploaded to Cloudinary: ${file.path}`);

  const newService = new Service({
    name,
    description,
    imagePath: file.path, // cloudinary secure_url
    price,
    duration,
    availability: JSON.parse(availability),
  });

  try {
    const savedService = await newService.save();
    console.log('✅ Service saved to DB with ID:', savedService._id);
    await generateSlots(savedService._id, JSON.parse(availability), duration);
    res.status(201).json(savedService);
  } catch (err) {
    console.error('❌ Error saving service:', err.message);
    res.status(500).send('Server error');
  }
});

// ✅ PUT route to update a service
router.put('/:id', auth, upload.single('image'), async (req, res) => {
  console.log('🛠️ [PUT /services/:id] ➡️ Endpoint hit');

  const { id } = req.params;
  const { name, description, price, duration } = req.body;
  const { file } = req;

  if (!file) {
    console.log('❌ No image file uploaded during update');
    return res.status(400).json({ message: 'No image uploaded' });
  }

  const updatedService = {
    name,
    description,
    imagePath: file.path, // cloudinary url
    price,
    duration,
  };

  try {
    const service = await Service.findByIdAndUpdate(id, updatedService, { new: true, runValidators: true });

    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    res.status(200).json(service);
  } catch (err) {
    console.error('❌ Error updating service:', err.message);
    res.status(500).send('Server error');
  }
});

// ✅ DELETE route
router.delete('/:id', async (req, res) => {
  console.log('🗑️ [DELETE /services/:id] ➡️ Endpoint hit');

  try {
    const service = await Service.findById(req.params.id);
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    // Optional: Delete from Cloudinary (if you store public_id)
    // await cloudinary.uploader.destroy(service.cloudinaryPublicId);

    await service.deleteOne({ _id: req.params.id });
    res.status(200).json({ message: 'Service deleted successfully' });
  } catch (err) {
    console.error('❌ Error deleting service:', err.message);
    res.status(500).send('Server error');
  }
});

// ✅ Other routes remain unchanged
router.get('/', async (req, res) => {
  try {
    const services = await Service.find();
    res.status(200).json(services);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

router.get('/:id', async (req, res) => {
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

router.post('/slots', auth, async (req, res) => {
  const { serviceId } = req.body;
  try {
    const slots = await Slot.find({
      serviceId: serviceId,
      isBooked: false,
    });
    if (slots.length === 0) {
      return res.json({ message: 'No slots found' });
    }
    return res.json(slots);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;



