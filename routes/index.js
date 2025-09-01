const router = require('express').Router();
const { userAuthMiddleware } = require('../middleware/authentication');
const authRouter = require('./authRouter');
const userRouter = require('./userRouter');
const productRouter = require('./productRouter');

router.use('/auth', authRouter);
router.use('/user', userAuthMiddleware, userRouter);
router.use('/product', userAuthMiddleware, productRouter);

module.exports = router;