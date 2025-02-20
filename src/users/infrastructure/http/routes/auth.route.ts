import { Router } from 'express'
import { authenticateUserController } from '../controllers/authenticate-user.controller'

const authRouter = Router()

//First swagger documentation with the product creation endpoint
/**
 * @swagger
 * components:
 *   schemas:
 *     AuthResponse:
 *       type: object
 *       properties:
 *         access_token:
 *           type: string
 *           description: Access Token (JWT)
 *       example:
 *         access_token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwibmFtZSI6IlVzZXIiLCJlbWFpbCI6InVzZXJAbWFpbC5jb20iLCJpYXQiOjE1MTYyMzkwMjJ9.1b9d1b8
 */
//Setting the header for the swagger documentation
/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: The authentication managing API
 */

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Authenticate a user with email and password
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AuthResponse'
 *     responses:
 *       200:
 *         description: The user was successfully authenticated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       400:
 *         description: Input data not provided or invalid
 */
authRouter.post('/login', authenticateUserController)

export { authRouter }
