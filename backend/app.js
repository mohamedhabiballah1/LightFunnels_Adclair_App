const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const authRoutes = require('./routes/authRoutes');
const webhookRoutes = require('./routes/webhookRoutes');
const storesRoutes = require('./routes/storesRoutes');
const storeStatus = require('./routes/storeStatusRoutes');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// Validate Environment Variables
if (!process.env.MONGO_URI) {
  console.error('MONGO_URI is not defined in environment variables.');
  process.exit(1);
}

if (!process.env.FRONTEND_URL) {
  console.error('FRONTEND_URL is not defined in environment variables.');
  process.exit(1);
}

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch((err) => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });


app.use(express.json());
app.use(cookieParser());


app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
  })
);

app.use('/auth', authRoutes);
app.use('/webhook', webhookRoutes);
app.use('/store', storesRoutes);
app.use('/status', storeStatus);

// app.get('/', (req, res) => {
//   res.redirect(`${process.env.FRONTEND_URL}/dashboard`);
// });

// app.use((err, req, res, next) => {
//   console.error('Unhandled error:', err.message);
//   res.status(500).json({ error: 'An unexpected error occurred. Please try again later.' });
// });

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
