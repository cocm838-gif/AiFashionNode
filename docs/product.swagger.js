/**
 * @swagger
 * tags:
 *   - name: Products
 *     description: Product content and interactions
 *
 * components:
 *   schemas:
 *     Product:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: Mongo ObjectId
 *         userId:
 *           type: string
 *           description: Owner user id (string)
 *         title:
 *           type: string
 *         image:
 *           type: string
 *           description: Cloudinary image URL
 *         price:
 *           type: number
 *         description:
 *           type: string
 *         currency:
 *           type: string
 *           enum: [INR, USD, EUR, GBP, JPY]
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *         userName:
 *           type: string
 *           description: Name of the product owner
 *         userImage:
 *           type: string
 *           description: Profile image URL of the product owner
 *         __v:
 *           type: integer
 *           description: Mongoose version key
 *
 *     CreateProductResponse:
 *       allOf:
 *         - $ref: '#/components/schemas/SuccessResponse'
 *         - type: object
 *           properties:
 *             data:
 *               $ref: '#/components/schemas/Product'
 *
 *     InteractionItem:
 *       type: object
 *       properties:
 *         productId:
 *           type: string
 *           description: Mongo ObjectId of the product
 *         actedAt:
 *           type: string
 *           format: date-time
 *
 *     InteractionListResponse:
 *       allOf:
 *         - $ref: '#/components/schemas/SuccessResponse'
 *         - type: object
 *           properties:
 *             data:
 *               type: object
 *               properties:
 *                 items:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Product'
 *                 total:
 *                   type: integer
 *                 page:
 *                   type: integer
 *                 limit:
 *                   type: integer
 *
 *     SuggestionsResponse:
 *       allOf:
 *         - $ref: '#/components/schemas/SuccessResponse'
 *         - type: object
 *           properties:
 *             data:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 *
 */

/**
 * @swagger
 * /product:
 *   post:
 *     summary: Create a product
 *     description: Upload image to Cloudinary and create a product.
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required: [image, title, price]
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *               title:
 *                 type: string
 *                 default: ""
 *               price:
 *                 type: number
 *               description:
 *                 type: string
 *                 nullable: true
 *                 default: ""
 *               currency:
 *                 type: string
 *                 enum: [INR, USD, EUR, GBP, JPY]
 *                 nullable: true
 *                 default: ""
 *     responses:
 *       200:
 *         description: Product created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CreateProductResponse'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationErrorResponse'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /product/{productId}/like:
 *   post:
 *     summary: Like a product
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         description: Product MongoID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Liked
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationErrorResponse'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /product/{productId}/skip:
 *   post:
 *     summary: Skip a product
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         description: Product MongoID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Skipped
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationErrorResponse'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /product/likes:
 *   get:
 *     summary: Get liked products (merged across weeks)
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number (>=1)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *         description: Page size (1-100)
 *     responses:
 *       200:
 *         description: Likes fetched
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/InteractionListResponse'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /product/skips:
 *   get:
 *     summary: Get skipped products (merged across weeks)
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number (>=1)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *         description: Page size (1-100)
 *     responses:
 *       200:
 *         description: Skips fetched
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/InteractionListResponse'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /product/suggestions:
 *   get:
 *     summary: Get suggested products (random 10 not mine, not liked/skipped)
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Suggestions fetched
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuggestionsResponse'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */


