const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./src/config/db');
const cors = require('cors');
const path = require('path');

dotenv.config();
connectDB();

const app = express();

// 🔥 Debug Logs
console.log("🔥 SERVER STARTING...");
console.log("NODE_ENV:", process.env.NODE_ENV);
console.log("__dirname:", __dirname);

// ✅ CORS Setup (final fixed version)
const corsOptions = {
  origin: [
    'http://localhost:5173', 
    'https://fix-friend.vercel.app', 
    'https://fix-friend-kiramen-vis-projects.vercel.app',
    'https://fix-friend-git-main-kiramen-vis-projects.vercel.app'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // handle preflight requests

// ✅ JSON Parsing
app.use(express.json());

// ✅ Static folder for uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ✅ Route imports
const authRoutes = require(path.join(__dirname, 'src', 'routes', 'authRoutes'));
const userRoutes = require(path.join(__dirname, 'src', 'routes', 'userRoutes'));
const serviceRoutes = require(path.join(__dirname, 'src', 'routes', 'serviceRoutes'));
const technicianRoutes = require(path.join(__dirname, 'src', 'routes', 'technicianRoutes'));
const adminRoutes = require(path.join(__dirname, 'src', 'routes', 'adminRoutes'));
const feedbackRoutes = require(path.join(__dirname, 'src', 'routes', 'feedbackRoutes'));

// ✅ Mount routes
app.use('/api/auth', authRoutes);
console.log('✅ /api/auth route loaded');

app.use('/api/user', userRoutes);
console.log('✅ /api/user route loaded');

app.use('/api/service', serviceRoutes);
console.log('✅ /api/service route loaded');

app.use('/api/technician', technicianRoutes);
console.log('✅ /api/technician route loaded');

app.use('/api/admin', adminRoutes);
console.log('✅ /api/admin route loaded');

app.use('/api/feedback', feedbackRoutes);
console.log('✅ /api/feedback route loaded');

// ✅ Health check route
app.get('/', (req, res) => {
  res.send('FixFriend API is live.');
});

// ✅ 404 fallback handler
app.use((req, res) => {
  console.log(`❌ Unmatched route: ${req.method} ${req.originalUrl}`);
  res.status(404).send('Not Found');
});

// ✅ Serve frontend in production
const __dirname1 = path.resolve();
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname1, '/client/dist')));
  app.get('*', (req, res) =>
    res.sendFile(path.resolve(__dirname1, 'client', 'dist', 'index.html'))
  );
}

// ✅ Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
