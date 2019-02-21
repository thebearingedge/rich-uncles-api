import createApi from './api/create-api'
import { knex } from './database/connections'

const api = createApi({ knex })

api.listen(process.env.PORT, () => {
  // eslint-disable-next-line no-console
  console.log('Listening on port', process.env.PORT)
})
