const Router = require('express');
const router = new Router();

const applicationController = require('../controllers/applicationController');

const authMiddleware = require('../middleware/authMiddleware');
const checkRole = require('../middleware/checkRoleMiddleware');

/**
 * @swagger
 * /api/v1/applications:
 *   post:
 *     summary: Create a new application
 *     tags: [Applications]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               full_name:
 *                 type: string
 *                 example: "John Doe"
 *               phone_number:
 *                 type: string
 *                 example: "+1234567890"
 *               content:
 *                 type: string
 *                 example: "Looking for a new business opportunity"
 *     responses:
 *       200:
 *         description: Application successfully created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 1
 *                 full_name:
 *                   type: string
 *                   example: "John Doe"
 *                 phone_number:
 *                   type: string
 *                   example: "+1234567890"
 *                 content:
 *                   type: string
 *                   example: "Looking for a new business opportunity"
 *       400:
 *         description: Bad request
 *       409:
 *         description: Application has already been submitted
 */
router.post('/', authMiddleware, applicationController.createApplication);

/**
 * @swagger
 * /api/v1/applications/{id}:
 *   delete:
 *     summary: Delete an application
 *     tags: [Applications]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID of the application to delete
 *     responses:
 *       204:
 *         description: Application successfully deleted
 *       403:
 *         description: No permission to delete this application
 *       404:
 *         description: Application not found
 *       400:
 *         description: Bad request
 */
router.delete('/:id', authMiddleware, checkRole('ADMIN'), applicationController.deleteApplication);

module.exports = router;