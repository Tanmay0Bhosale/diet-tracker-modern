const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoutes');
const mealRoutes = require('./routes/mealRoutes');

dotenv.config();
const app = express();

// CORS middleware - MUST come before routes
app.use(cors({
  origin: [
    'http://13.124.195.254:5173',
    'http://localhost:5173'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/meals', mealRoutes);

const PORT = process.env.PORT || 5000;
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
.then(()=> {
  console.log('Connected to MongoDB');
  app.listen(PORT, ()=> console.log(`Server running on port ${PORT}`));
})
.catch(err => {
  console.error('MongoDB connection error', err);
});

