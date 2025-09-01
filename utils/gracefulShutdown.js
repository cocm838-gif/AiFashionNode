const { gracefulShutdown: dbGracefulShutdown } = require('../config/database');

// Graceful shutdown handler
const gracefulShutdown = async (signal, server) => {
  console.log(`\n${signal} received. Starting graceful shutdown...`);
  
  try {
    // Close server
    if (server) {
      server.close(() => {
        console.log('HTTP server closed');
      });
    }
    
    // Disconnect database
    await dbGracefulShutdown();
    
    process.exit(0);
  } catch (error) {
    console.error('Error during shutdown:', error);
    process.exit(1);
  }
};

// Setup shutdown handlers
const setupShutdownHandlers = (server) => {
  // Handle shutdown signals
  process.on('SIGTERM', () => gracefulShutdown('SIGTERM', server));
  process.on('SIGINT', () => gracefulShutdown('SIGINT', server));

  // Handle uncaught exceptions
  process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err);
    gracefulShutdown('uncaughtException', server);
  });

  process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
    gracefulShutdown('unhandledRejection', server);
  });
};

module.exports = { setupShutdownHandlers };
