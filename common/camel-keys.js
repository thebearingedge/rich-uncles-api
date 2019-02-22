import camelCase from 'lodash/camelCase'
import isPlainObject from 'lodash/isPlainObject'

export default function camelKeys(value) {
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
