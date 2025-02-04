import express from 'express'
import cors from 'cors'
import { routes } from './routes'
import { errorHandler } from './middlewares/errorHandler'
import swaggerJSDoc from 'swagger-jsdoc'
import swaggerUi from 'swagger-ui-express'

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API Documentation',
      version: '1.0.0',
    },
  },
  apis: [],
}
const swaggerSpec = swaggerJSDoc(options) // Generate the OpenAPI specification with the given options

const app = express() // Create an Express application

app.use(cors()) // Enable CORS
app.use(express.json()) // Parse JSON bodies
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec)) // Endpoint to access the API documentation
app.use(routes) // Common routes
app.use(errorHandler) // Error handler middleware

export { app }
