import Knex from 'knex'
import snakeCase from 'lodash/snakeCase'
import camelKeys from '../common/camel-keys'

export const knex = Knex({
  client: 'pg',
  connection: process.env.POSTGRES_URL,
  postProcessResponse: camelKeys,
  wrapIdentifier: (identifier, wrap) => {
    return identifier === '*'
      ? identifier
      : wrap(snakeCase(identifier))
  }
})
