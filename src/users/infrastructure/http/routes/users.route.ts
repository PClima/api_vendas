import { Router } from 'express'
import { CreateUserUseCase } from '@/users/application/usecases/create-user.usecase'
import { createUserController } from '../controllers/create-product.controller'

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
 *     tags: [Users]
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

export { usersRouter }
