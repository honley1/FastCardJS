const Router = require('express');
const router = new Router();

const userRouter = require('./userRouter');
const businessCardRouter = require('./businessCardRouter');
const applicationRouter = require('./applicationRouter');

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management
 */
router.use('/user', userRouter);

/**
 * @swagger
 * tags:
 *   name: Business Cards
 *   description: Business cards management
 */
router.use('/business-cards', businessCardRouter);

/**
 * @swagger
 * tags:
 *   name: Applications
 *   description: Applications management
 */
router.use('/application', applicationRouter);

module.exports = router;