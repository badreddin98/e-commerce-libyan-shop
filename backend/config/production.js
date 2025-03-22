// Validate required environment variables
const requiredEnvVars = [
  'MONGODB_URI',
  'JWT_SECRET',
  'NODE_ENV',
  'CLIENT_URL'
];

const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);

if (missingEnvVars.length > 0) {
  throw new Error(`Missing required environment variables: ${missingEnvVars.join(', ')}`);
}

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
  clientUrl: process.env.CLIENT_URL,
  // Session secret
  sessionSecret: process.env.SESSION_SECRET || 'your-session-secret-key',
  // Cookie settings
  cookieSettings: {
    secure: true,
    httpOnly: true,
    sameSite: 'strict',
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
};
