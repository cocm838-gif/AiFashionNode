// app.js
const express = require("express");
require("dotenv").config();

// Import modular components
const { prisma } = require('./config');
require('./config/mongoose');
const {
  setupSecurityMiddleware,
  requestLogger,
  errorLogger,
  errorHandler,
  notFoundHandler
} = require('./middleware');
const { setupSwagger } = require('./config');
const { setupShutdownHandlers } = require('./utils/gracefulShutdown');

// Import routes
const routes = require('./routes');

const app = express();
const PORT = process.env.PORT || 3000;

// Trust proxy for rate limiting and security middleware
app.set('trust proxy', 1);

// Setup security middleware
setupSecurityMiddleware(app);

// Middleware to parse JSON
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging middleware
app.use(requestLogger);

// Setup Swagger documentation
setupSwagger(app);

// Routes
app.use('/', routes);

app.get("/", (req, res) => {
  res.send("🚀 Express + Prisma + PostgreSQL App running with Phone field!");
});

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});


// Error handling middleware
app.use(notFoundHandler);
app.use(errorLogger);
app.use(errorHandler);

// Start server
const server = app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
  console.log(`📚 Swagger UI available at http://localhost:${PORT}/api-docs`);
});

// Setup graceful shutdown handlers
setupShutdownHandlers(server);

// Export for testing
module.exports = { app, server, prisma };