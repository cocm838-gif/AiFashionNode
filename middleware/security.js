const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

// Security middleware setup
const setupSecurityMiddleware = (app) => {
  // Security headers
  app.use(helmet());

  // CORS middleware
  app.use(cors({
    origin: process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : ['http://localhost:3000'],
    credentials: true
  }));

  // Rate limiting
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later.'
  });
  app.use(limiter);
};

module.exports = { setupSecurityMiddleware };
