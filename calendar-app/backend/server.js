const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const { initializeDB } = require('./config/db');

// Load environment variables
dotenv.config();

// Initialize express app
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Initialize database
initializeDB()
  .then(() => console.log('Database initialized'))
  .catch(err => console.error('Database initialization error:', err));

// Import routes
const eventRoutes = require('./routes/events');
const userRoutes = require('./routes/users');

// Use routes
app.use('/api/events', eventRoutes);
app.use('/api/users', userRoutes);

// Root route
app.get('/', (req, res) => {
  res.send('Calendar Management API is running');
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});