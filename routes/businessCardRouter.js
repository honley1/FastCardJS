const Router = require('express');
const router = new Router();

const businessCardController = require('../controllers/businessCardController');
const authMiddleware = require('../middleware/authMiddleware');
const checkRole = require('../middleware/checkRoleMiddleware');

/**
 * @swagger
 * /api/v1/business-cards/{id}:
 *   get:
 *     summary: Retrieve a business card by ID
 *     tags: [Business Cards]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID of the business card
 *     responses:
 *       200:
 *         description: Successfully retrieved business card
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 1
 *                 user_id:
 *                   type: integer
 *                   example: 123
 *                 content:
 *                   type: string
 *                   example: "Business card content here"
 *                 isActivated:
 *                   type: boolean
 *                   example: true
 *       404:
 *         description: Business card not found
 *       403:
 *         description: Business card not activated
 *       400:
 *         description: Bad request
 */
router.get('/:id', businessCardController.getBusinessCardById);

/**
 * @swagger
 * /api/v1/business-cards/activate:
 *   post:
 *     summary: Activate a business card
 *     tags: [Business Cards]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 example: "john_doe"
 *             required:
 *               - username
 *     responses:
 *       200:
 *         description: Business card successfully activated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 1
 *                 user_id:
 *                   type: integer
 *                   example: 123
 *                 content:
 *                   type: string
 *                   example: "Business card content here"
 *                 isActivated:
 *                   type: boolean
 *                   example: true
 *       404:
 *         description: User or business card not found
 *       400:
 *         description: Bad request
 */
router.post('/activate', checkRole('ADMIN'), businessCardController.activateBusinessCard);

/**
 * @swagger
 * /api/v1/business-cards:
 *   put:
 *     summary: Update a business card
 *     tags: [Business Cards]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: integer
 *                 example: 1
 *               content:
 *                 type: string
 *                 example: "Updated content for the business card"
 *             required:
 *               - id
 *               - content
 *     responses:
 *       200:
 *         description: Business card successfully updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 1
 *                 user_id:
 *                   type: integer
 *                   example: 123
 *                 content:
 *                   type: string
 *                   example: "Business card content here"
 *                 isActivated:
 *                   type: boolean
 *                   example: true
 *       403:
 *         description: No permission to update this business card
 *       404:
 *         description: Business card not found
 *       400:
 *         description: Bad request
 */
router.put('/', authMiddleware, businessCardController.updateBusinessCard);

/**
 * @swagger
 * /api/v1/business-cards/{id}:
 *   delete:
 *     summary: Delete a business card
 *     tags: [Business Cards]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID of the business card to delete
 *     responses:
 *       204:
 *         description: Business card successfully deleted
 *       403:
 *         description: No permission to delete this business card
 *       404:
 *         description: Business card not found
 *       400:
 *         description: Bad request
 */
router.delete('/:id', authMiddleware, businessCardController.deleteBusinessCard);

module.exports = router;
