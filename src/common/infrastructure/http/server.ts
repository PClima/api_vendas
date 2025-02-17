import { env } from '../env'
import { dataSource } from '../typeorm'
import { app } from './app'
import '@/common/infrastructure/container'

//Initialize the db connection and start the server, if the connection is successful, otherwise log the error
dataSource
  .initialize()
  .then(() => {
    app.listen(env.PORT, () => {
      console.log(`Server is running on port ${env.PORT}`)
      console.log(
        `API documentation is available at http://localhost:${env.PORT}/docs`,
      )
    })
  })
  .catch(error => {
    console.log('Error initializing data source:', error)
  })
