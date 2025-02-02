import cors from 'cors'
import { routes } from './routes'

const express = require('express')
const app = express()

app.use(cors())
app.use(express.json())
app.use(routes)

export { app }
