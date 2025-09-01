const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

// Graceful shutdown for database
const gracefulShutdown = async () => {
  try {
    await prisma.$disconnect();
    console.log('Prisma client disconnected');
  } catch (error) {
    console.error('Error disconnecting Prisma client:', error);
  }
};

// Handle shutdown signals for database
process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);

module.exports = { prisma, gracefulShutdown };
