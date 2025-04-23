const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./src/config/db');
const cors = require('cors');
const path = require('path');

dotenv.config();
connectDB();

const app = express();


const allowedOrigins = [
    'http://localhost:5173',
    'https://fix-friend.vercel.app'
  ];
  
  app.use(cors({
    origin: allowedOrigins,
    credentials: true
  }));
  
app.use(express.json());


app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


const authRoutes = require('./src/routes/authRoutes');
console.log(' authRoutes is:', typeof authRoutes);

const userRoutes = require('./src/routes/userRoutes');
console.log(' userRoutes is:', typeof userRoutes);

const serviceRoutes = require('./src/routes/serviceRoutes');
console.log(' serviceRoutes is:', typeof serviceRoutes);

const technicianRoutes = require('./src/routes/technicianRoutes');
console.log(' technicianRoutes is:', typeof technicianRoutes);

const adminRoutes = require('./src/routes/adminRoutes');
console.log(' adminRoutes is:', typeof adminRoutes);

const feedbackRoutes = require('./src/routes/feedbackRoutes');
console.log(' feedbackRoutes is:', typeof feedbackRoutes);


app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/service', serviceRoutes);
app.use('/api/technician', technicianRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/feedback', feedbackRoutes);


const __dirname1 = path.resolve();
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname1, '/client/dist')));
  app.get('*', (req, res) =>
    res.sendFile(path.resolve(__dirname1, 'client', 'dist', 'index.html'))
  );
}


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(` Server running on port ${PORT}`));
