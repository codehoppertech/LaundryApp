const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const config = require('./config/config');
const userRoutes = require('./routes/userRoutes');
const businessRoutes = require('./routes/businessRoutes');
const hubRoutes = require('./routes/hubRoutes');
const { errorResponse } = require('./utils/response');
const dotenv = require('dotenv');
//const notificationRoutes = require('./routes/notificationRoutes');
const userManagementRoutes = require('./routes/userManagementRoutes');
const fileUpload = require('express-fileupload');
// Initialize express app
const app = express();
dotenv.config();
// Security middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(fileUpload());
// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later'
});
app.use('/api/', limiter);

// Routes
app.use('/api/user', userRoutes);
app.use('/api/business', businessRoutes);
app.use('/api/hub', hubRoutes);
//app.use('/api/notifications', notificationRoutes);
app.use('/api/businessusers', userManagementRoutes);
// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'success', message: 'Server is healthy' });
});

// 404 handler
app.use((req, res) => {
  errorResponse(res, 404, 'Endpoint not found');
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  errorResponse(res, 500, 'Internal server error', {
    description: config.env === 'development' ? err.message : 'Something went wrong'
  });
});

// Database connection
mongoose.connect(config.mongoUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log('Connected to MongoDB');
  // Start server only after successful database connection
  app.listen(config.port, () => {
    console.log(`Server running on port ${config.port}`);
  });
})
.catch(err => {
  console.error('MongoDB connection error:', err);
  process.exit(1);
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);
  process.exit(1);
});

module.exports = app;