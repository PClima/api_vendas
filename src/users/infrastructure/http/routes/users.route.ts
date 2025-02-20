import { Router } from 'express'
import { createUserController } from '../controllers/create-user.controller'
import { searchUserController } from '../controllers/search-user.controller'
import { authenticateUserController } from '../controllers/authenticate-user.controller'

const usersRouter = Router()

//First swagger documentation with the product creation endpoint
/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - name
 *         - email
 *         - password
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id (uuid) of the product
 *         name:
 *           type: string
 *           description: The user name
 *         email:
 *           type: string
 *           description: The user email
 *         password:
 *           type: string
 *           description: The user password
 *         avatar:
 *           type: string
 *           description: The user avatar link
 *         created_at:
 *           type: string
 *           format: date-time
 *           description: The date the user was added
 *         updated_at:
 *           type: string
 *           format: date-time
 *           description: The date the user was last updated
 *       example:
 *         id: 06db518e-613b-4a76-8e4f-2e305fe4f68d
 *         name: Sample user
 *         email: user@mail.com
 *         password: password123
 *         avatar: https://avatar.com/avatar.png
 *         created_at: 2023-01-01T10:00:00Z
 *         updated_at: 2023-01-01T10:00:00Z
 */
//Setting the header for the swagger documentation
/**
 * @swagger
 * tags:
 *   name: Users
 *   description: The users managing API
 */

//Definition of swagger documentation for the product creation endpoint
/**
 * @swagger
 * /users:
 *   post:
 *     summary: Create a new user
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 description: The user name
 *               email:
 *                 type: string
 *                 description: The user email
 *               password:
 *                 type: string
 *                 description: The user password
 *             example:
 *                 name: Sample Product
 *                 email: user@mail.com
 *                 password: password123
 *     responses:
 *       201:
 *         description: The user was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Input data not provided or invalid
 *       409:
 *         description: Email already used by another user
 */
usersRouter.post('/', createUserController)

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Search for users
 *     tags: [User]
 *     parameters:
 *       - in: query
 *         name: page
 *         required: false
 *         description: The required page number
 *         schema:
 *          type: number
 *          default: 1
 *       - in: query
 *         name: per_page
 *         required: false
 *         description: Quantity of users per page
 *         schema:
 *          type: number
 *          default: 15
 *       - in: query
 *         name: sort
 *         required: false
 *         description: The field to sort the users
 *         schema:
 *          type: string
 *          default: null
 *       - in: query
 *         name: sort_dir
 *         required: false
 *         description: The direction to sort the users
 *         schema:
 *          type: string
 *          default: null
 *       - in: query
 *         name: filter
 *         required: false
 *         description: The filter to search the users
 *         schema:
 *          type: string
 *          default: null
 *     responses:
 *       200:
 *         description: The products were successfully found
 *         content:
 *          application/json:
 *           schema:
 *            type: array
 *            items:
 *              $ref: '#/components/schemas/User'
 */
usersRouter.get('/', searchUserController)

/**
 * @swagger
 * /users/authenticate:
 *   get:
 *     summary: Authenticate a user with email and password
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 description: The user email
 *               password:
 *                 type: string
 *                 description: The user password
 *             example:
 *                 email: user@mail.com
 *                 password: password123
 *     responses:
 *       201:
 *         description: The user was successfully authenticated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Input data not provided or invalid
 */
usersRouter.get('/authenticate', authenticateUserController)

export { usersRouter }
