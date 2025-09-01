/**
 * @swagger
 * components:
 *   schemas:
 *     WelcomeResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         message:
 *           type: string
 *           example: "Welcome to AiFassion API"
 *         data:
 *           type: object
 *           properties:
 *             version:
 *               type: string
 *               example: "1.0.0"
 *             status:
 *               type: string
 *               example: "running"
 *             timestamp:
 *               type: string
 *               format: date-time
 *               example: "2024-01-01T00:00:00.000Z"
 *     
 *     HealthResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         message:
 *           type: string
 *           example: "Service is healthy"
 *         data:
 *           type: object
 *           properties:
 *             status:
 *               type: string
 *               example: "healthy"
 *             uptime:
 *               type: number
 *               example: 3600
 *             timestamp:
 *               type: string
 *               format: date-time
 *               example: "2024-01-01T00:00:00.000Z"
 *             database:
 *               type: string
 *               example: "connected"
 *             environment:
 *               type: string
 *               example: "development"
 */

/**
 * @swagger
 * /:
 *   get:
 *     summary: Welcome message
 *     description: Returns a welcome message with API information
 *     tags: [System]
 *     security: []   # 🚀 This disables the global bearerAuth for this endpoint
 *     responses:
 *       200:
 *         description: Welcome message
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/WelcomeResponse'
 */

/**
 * @swagger
 * /health:
 *   get:
 *     summary: Health check
 *     description: Returns the health status of the API service
 *     tags: [System]
 *     security: []   # 🚀 This disables the global bearerAuth for this endpoint
 *     responses:
 *       200:
 *         description: Service is healthy
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/HealthResponse'
 *       503:
 *         description: Service is unhealthy
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: "Service Unavailable"
 *                 message:
 *                   type: string
 *                   example: "Service is unhealthy"
 */
