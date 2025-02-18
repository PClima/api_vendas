import { Router } from 'express'
import { createProductController } from '../controllers/create-product.controller'
import { getProductController } from '../controllers/get-product.controller'
import { updateProductController } from '../controllers/update-product.controller'
import { deleteProductController } from '../controllers/delete-product.controller'
import { searchProductController } from '../controllers/search-product.controller'

const productsRouter = Router()

//First swagger documentation with the product creation endpoint
/**
 * @swagger
 * components:
 *   schemas:
 *     Product:
 *       type: object
 *       required:
 *         - name
 *         - price
 *         - quantity
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id (uuid) of the product
 *         name:
 *           type: string
 *           description: The name of the product
 *         price:
 *           type: number
 *           description: The price of the product
 *         quantity:
 *           type: number
 *           description: The quantity of the product
 *         created_at:
 *           type: string
 *           format: date-time
 *           description: The date the product was added
 *         updated_at:
 *           type: string
 *           format: date-time
 *           description: The date the product was last updated
 *       example:
 *         id: 06db518e-613b-4a76-8e4f-2e305fe4f68d
 *         name: Sample Product
 *         price: 29.99
 *         quantity: 100
 *         created_at: 2023-01-01T10:00:00Z
 *         updated_at: 2023-01-01T10:00:00Z
 *     ProductListResponse:
 *       type: object
 *       properties:
 *         items:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Product'
 *         per_page:
 *           type: integer
 *           description: The quantity of products per page
 *         total:
 *           type: integer
 *           description: The total number of products
 *         current_page:
 *           type: integer
 *           description: The current page number
 *         last_page:
 *           type: integer
 *           description: The last page number
 *       example:
 *         items:
 *           - id: 06db518e-613b-4a76-8e4f-2e305fe4f68d
 *             name: Sample Product
 *             price: 29.99
 *             quantity: 100
 *             created_at: 2023-01-01T10:00:00Z
 *             updated_at: 2023-01-01T10:00:00Z
 *         per_page: 10
 *         total: 1
 *         current_page: 1
 *         last_page: 1
 */
//Setting the header for the swagger documentation
/**
 * @swagger
 * tags:
 *   name: Products
 *   description: The products managing API
 */

//Definition of swagger documentation for the product creation endpoint
/**
 * @swagger
 * /products:
 *   post:
 *     summary: Create a new product
 *     tags: [Products]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - price
 *               - quantity
 *             properties:
 *               name:
 *                 type: string
 *                 description: The name of the product
 *               price:
 *                 type: number
 *                 description: The price of the product
 *               quantity:
 *                 type: number
 *                 description: The quantity of the product
 *             example:
 *                 name: Sample Product
 *                 price: 29.99
 *                 quantity: 100
 *     responses:
 *       201:
 *         description: The product was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       400:
 *         description: Input data not provided or invalid
 *       409:
 *         description: Name already used on another product
 */
productsRouter.post('/', createProductController)

/**
 * @swagger
 * /products/{id}:
 *   get:
 *     summary: Get a product by id
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The id of the product
 *         schema:
 *          type: string
 *     responses:
 *       200:
 *         description: The product was successfully get
 *         content:
 *          application/json:
 *           schema:
 *            $ref: '#/components/schemas/Product'
 *       400:
 *         description: Input data not provided or invalid
 *       404:
 *         description: Product not found
 */
productsRouter.get('/:id', getProductController)

/**
 * @swagger
 * /products/{id}:
 *   put:
 *     summary: Update a product
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The id of the product
 *         schema:
 *          type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id
 *             properties:
 *               id:
 *                 type: string
 *                 description: The id of the product to be updated
 *               name:
 *                 type: string
 *                 description: The new name of the product to be updated
 *               price:
 *                 type: number
 *                 description: The new price of the product to be updated
 *               quantity:
 *                 type: number
 *                 description: The new quantity of the product to be updated
 *             example:
 *               name: New Sample Product
 *               price: 39.99
 *               quantity: 200
 *     responses:
 *       201:
 *         description: The product was successfully updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       400:
 *         description: Input data not provided or invalid
 *       404:
 *         description: Product not found
 */
productsRouter.put('/:id', updateProductController)

/**
 * @swagger
 * /products/{id}:
 *   delete:
 *     summary: Delete a product
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The id of the product
 *         schema:
 *          type: string
 *     responses:
 *       201:
 *         description: The product was successfully deleted
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       400:
 *         description: Input data not provided or invalid
 *       404:
 *         description: Product not found
 */
productsRouter.delete('/:id', deleteProductController)

/**
 * @swagger
 * /products:
 *   get:
 *     summary: Search for products
 *     tags: [Products]
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
 *         description: Quantity of products per page
 *         schema:
 *          type: number
 *          default: 15
 *       - in: query
 *         name: sort
 *         required: false
 *         description: The field to sort the products
 *         schema:
 *          type: string
 *          default: null
 *       - in: query
 *         name: sort_dir
 *         required: false
 *         description: The direction to sort the products
 *         schema:
 *          type: string
 *          default: null
 *       - in: query
 *         name: filter
 *         required: false
 *         description: The filter to search the products
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
 *              $ref: '#/components/schemas/Product'
 */
productsRouter.get('/', searchProductController)

export { productsRouter }
