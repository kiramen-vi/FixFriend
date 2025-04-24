const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./src/config/db');
const cors = require('cors');
const path = require('path');

dotenv.config();
connectDB();

const app = express();

// ✅ CORS Setup
const corsOptions = {
  origin: ['http://localhost:5173', 'https://fix-friend.vercel.app'],
  credentials: true,
};
app.use(cors(corsOptions));
app.use(express.json());

// ✅ Static folder for uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ✅ Import routes
const authRoutes = require('./src/routes/authRoutes');
const userRoutes = require('./src/routes/userRoutes');
const serviceRoutes = require('./src/routes/serviceRoutes');
const technicianRoutes = require('./src/routes/technicianRoutes');
const adminRoutes = require('./src/routes/adminRoutes');
const feedbackRoutes = require('./src/routes/feedbackRoutes');

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

// ✅ Ping route for testing
app.get('/api/auth/ping', (req, res) => {
  console.log("✅ /api/auth/ping was hit");
  res.send('pong');
});

// ✅ Route debug middleware (optional but useful)
app.use((req, res, next) => {
  console.log(`❌ Unmatched Route: ${req.method} ${req.originalUrl}`);
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