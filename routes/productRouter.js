const router = require('express').Router();
const { userAuthMiddleware } = require('../middleware/authentication');
const { validationSchemas } = require('../middleware');
const productController = require('../controllers/productController');
const upload = require('../middleware/upload');

// All routes require authenticated user
router.use(userAuthMiddleware);

// Create product
router.post('/', upload.single('image'), validationSchemas.createProductSchema, productController.addProduct);

// Like a product
router.post('/:productId/like', validationSchemas.likeProductSchema, productController.likeProduct);

// Skip a product
router.post('/:productId/skip', validationSchemas.skipProductSchema, productController.skipProduct);

// Get likes and skips (aggregated)
router.get('/likes', validationSchemas.interactionsQuerySchema, productController.getLikes);
router.get('/skips', validationSchemas.interactionsQuerySchema, productController.getSkips);

// Suggestions (single aggregation)
router.get('/suggestions', productController.getSuggestions);

module.exports = router;


