const express = require('express');
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const serviceRoutes = require('./routes/serviceRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const authRoutes = require('./routes/authRoutes');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');



dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Middleware 
app.use(cors());
app.use(express.json());

// Define routes

app.use('/api/auth', authRoutes);

app.use('/api/users', userRoutes);

app.use('/api/services',  serviceRoutes);

app.use('/api/bookings', bookingRoutes);

app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.use('/',(req,res,next) => {
  res.json({message: 'Server is running'});
})




const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log("dirname",__dirname);
});
