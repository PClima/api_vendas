import { productsRouter } from '@/products/infrastructure/http/routes/products.route'
import { Router } from 'express'

const routes = Router()

routes.get('/', (req, res) => {
  return res.status(200).json({ message: 'Hello World ' })
})

//Using the products router
routes.use('/products', productsRouter)

export { routes }
