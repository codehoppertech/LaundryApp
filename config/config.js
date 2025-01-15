require('dotenv').config();

const config = {
  env: process.env.NODE_ENV || 'development',
  port: process.env.PORT || 3000,
  jwtSecret: process.env.JWT_SECRET || 'your-secret-key',
  mongoUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/mycontrol',
  //mongoUri: process.env.MONGODB_URI || 'mongodb://admin:admin@laundry@cluster0.jzde0.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0',
  email: {
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.EMAIL_PORT) || 587,
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
    from: process.env.EMAIL_FROM
  }
};

module.exports = config;