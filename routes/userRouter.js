const Router = require('express');
const router = new Router();

const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');
const checkRole = require('../middleware/checkRoleMiddleware');

/**
 * @swagger
 * /api/v1/user/registration:
 *   post:
 *     summary: Register a new user
 *     tags: [Users]
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
 *               email:
 *                 type: string
 *                 example: "john@example.com"
 *               password:
 *                 type: string
 *                 example: "password123"
 *             required:
 *               - username
 *               - email
 *               - password
 *     responses:
 *       200:
 *         description: Successfully registered
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   example: "123e4567-e89b-12d3-a456-426614174000"
 *                 username:
 *                   type: string
 *                   example: "john_doe"
 *                 email:
 *                   type: string
 *                   example: "john@example.com"
 *                 avatar:
 *                   type: string
 *                   example: "avatar.png"
 *                 isActivated:
 *                   type: boolean
 *                   example: false
 *       400:
 *         description: Bad request
 */
router.post('/registration', userController.registration);

/**
 * @swagger
 * /api/v1/user/login:
 *   post:
 *     summary: Login a user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: "john@example.com"
 *               password:
 *                 type: string
 *                 example: "password123"
 *             required:
 *               - email
 *               - password
 *     responses:
 *       200:
 *         description: Successfully logged in
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTYiLCJleHBpcmVkX3N0b3Jpb3QiOiJ0ZXN0IiwiaWF0IjoxNjEyMzQ2NTU5fQ.ZDgG0lQ6ZgZtDFr7zDF9KhXZRYWDFY-I44LsYH4EQUk"
 *       400:
 *         description: Bad request
 *       404:
 *         description: User not found
 *       401:
 *         description: Incorrect password
 */
router.post('/login', userController.login);

/**
 * @swagger
 * /api/v1/user/activate/{link}:
 *   get:
 *     summary: Activate a user account
 *     tags: [Users]
 *     parameters:
 *       - name: link
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: Activation link
 *     responses:
 *       200:
 *         description: Account activated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   example: "123e4567-e89b-12d3-a456-426614174000"
 *                 username:
 *                   type: string
 *                   example: "john_doe"
 *                 email:
 *                   type: string
 *                   example: "john@example.com"
 *                 avatar:
 *                   type: string
 *                   example: "avatar.png"
 *                 isActivated:
 *                   type: boolean
 *                   example: true
 *       400:
 *         description: Incorrect activation link or account already activated
 */
router.get('/activate/:link', userController.activate);

/**
 * @swagger
 * /api/v1/user/auth:
 *   get:
 *     summary: Authenticate a user
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Authentication successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "GOOD"
 *                 token:
 *                   type: string
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTYiLCJleHBpcmVkX3N0b3Jpb3QiOiJ0ZXN0IiwiaWF0IjoxNjEyMzQ2NTU5fQ.ZDgG0lQ6ZgZtDFr7zDF9KhXZRYWDFY-I44LsYH4EQUk"
 *       400:
 *         description: Bad request
 */
router.get('/auth', authMiddleware, userController.auth);

router.post('/checkAuth', userController.checkAuth);

/**
 * @swagger
 * /api/v1/user/{id}:
 *   get:
 *     summary: Get a user by ID
 *     tags: [Users]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: Successfully retrieved user
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   example: "123e4567-e89b-12d3-a456-426614174000"
 *                 username:
 *                   type: string
 *                   example: "john_doe"
 *                 email:
 *                   type: string
 *                   example: "john@example.com"
 *                 avatar:
 *                   type: string
 *                   example: "avatar.png"
 *                 isActivated:
 *                   type: boolean
 *                   example: true
 *       404:
 *         description: User not found
 *       400:
 *         description: Bad request
 */
router.get('/:id', authMiddleware, checkRole('ADMIN'), userController.getUserById);

/**
 * @swagger
 * /api/v1/user:
 *   get:
 *     summary: Get all users
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     example: "123e4567-e89b-12d3-a456-426614174000"
 *                   username:
 *                     type: string
 *                     example: "john_doe"
 *                   email:
 *                     type: string
 *                     example: "john@example.com"
 *                   avatar:
 *                     type: string
 *                     example: "avatar.png"
 *                   isActivated:
 *                     type: boolean
 *                     example: true
 *       400:
 *         description: Bad request
 */
router.get('/', authMiddleware, checkRole('ADMIN'), userController.getAllUsers);

module.exports = router;