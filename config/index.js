const { prisma, gracefulShutdown } = require('./database');
const { setupSwagger } = require('./swagger');
const twilioService = require('./twilio');
const s3 = require('./s3');

module.exports = {
  prisma,
  gracefulShutdown,
  setupSwagger,
  twilioService,
  s3
};
