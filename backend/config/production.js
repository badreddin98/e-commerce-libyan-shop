module.exports = {
  // Production environment settings
  env: 'production',
  // Use environment variable for MongoDB URI in production
  mongoUri: process.env.MONGODB_URI,
  // Use environment variable for JWT secret in production
  jwtSecret: process.env.JWT_SECRET,
  // Port for the server
  port: process.env.PORT || 5000,
  // Frontend URL in production
  clientUrl: process.env.CLIENT_URL || 'https://your-domain.com'
};
