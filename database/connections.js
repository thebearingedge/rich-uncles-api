import Knex from 'knex'
import camelCase from 'lodash/camelCase'
import snakeCase from 'lodash/snakeCase'
import isPlainObject from 'lodash/isPlainObject'

const camelKeys = value => {
  if (Array.isArray(value)) {
    return value.map(camelKeys)
  }
  if (isPlainObject(value)) {
    return Object
      .keys(value)
      .reduce((mapped, key) => ({
        ...mapped,
        [camelCase(key)]: camelKeys(value[key])
      }), {})
  }
  return value
}

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
