// const express = require('express');
// const connectDB = require('./config/db');
// const userRoutes = require('./routes/userRoutes');
// const serviceRoutes = require('./routes/serviceRoutes');
// const bookingRoutes = require('./routes/bookingRoutes');
// const authRoutes = require('./routes/authRoutes');
// const dotenv = require('dotenv');
// const cors = require('cors');
// const path = require('path');



// dotenv.config();

// // Connect to MongoDB
// connectDB();

// const app = express();

// // Middleware 
// app.use(cors());
// app.use(express.json());

// // Define routes

// app.use('/api/auth', authRoutes);

// app.use('/api/users', userRoutes);

// app.use('/api/services',  serviceRoutes);

// app.use('/api/bookings', bookingRoutes);

// app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// app.use('/',(req,res,next) => {
//   res.json({message: 'Server is running'});
// })




// const PORT = process.env.PORT || 5000;

// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
//   console.log("dirname",__dirname);
// });



const express = require('express');
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const serviceRoutes = require('./routes/serviceRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const authRoutes = require('./routes/authRoutes');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

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
app.use('/api/services', serviceRoutes);
app.use('/api/bookings', bookingRoutes);

// Serve uploads statically
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Root route
app.get('/', (req, res, next) => {
  res.json({ message: 'Server is running' });
});

// File system logger (ignores certain folders)
function logDirectoryContents(dir, indent = '', ignoreDirs = ['node_modules', '.git', 'build', '.next', 'dist']) {
  try {
    const items = fs.readdirSync(dir);
    for (const item of items) {
      if (ignoreDirs.includes(item)) continue;

      const fullPath = path.join(dir, item);
      const stats = fs.statSync(fullPath);

      console.log(indent + (stats.isDirectory() ? '📁 ' : '📄 ') + item);

      if (stats.isDirectory()) {
        logDirectoryContents(fullPath, indent + '  ', ignoreDirs);
      }
    }
  } catch (error) {
    console.error(`❌ Failed to read ${dir}:`, error.message);
  }
}

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log("🧭 Current Directory:", __dirname);

  const projectRoot = path.join(__dirname, '..');
  console.log("\n📂 File System from Project Root (excluding node_modules):\n");
  logDirectoryContents(projectRoot);
});


