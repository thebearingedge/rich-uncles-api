import axios from 'axios'
import chai from 'chai'
import identity from 'lodash/identity'
import { chaiStruct } from 'chai-struct'
import createApi from '../create-api'
import { knex } from '../../database/connections'

chai.use(chaiStruct)

let server
let _knex
let _client

before('Create an HTTP client', () => {
  _client = axios.create({
    validateStatus: () => true,
    baseURL: process.env.API_URL
  })
})

beforeEach('Start server and begin transaction', done => {
  handled(knex.transaction(trx => {
    (async () => {
      try {
        _knex = trx
        server = createApi({ knex: _knex })
          .listen(process.env.PORT, done)
      }
      catch (err) {
        done(err)
      }
    })()
  }))
})

afterEach('Stop server and rollback transaction', done => {
  server.close(async err => {
    if (err) return done(err)
    try {
      await _knex.rollback()
      done()
    }
    catch (err) {
      done(err)
    }
  })
})

after('Close database connections', async () => {
  await knex.destroy()
})

export const inject = setup => done => {
  (async () => {
    try {
      await setup({ _knex, _client })
      done()
    }
    catch (err) {
      done(err)
    }
  })()
}

export const handled = promise => promise.catch(identity)

export { expect } from 'chai'
