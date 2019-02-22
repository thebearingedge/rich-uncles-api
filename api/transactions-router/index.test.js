import jwt from 'jsonwebtoken'
import { inject, expect, TEST_USER } from '../test'

describe('POST /transactions', () => {

  let client
  let token
  let userId

  beforeEach(inject(async ({ _client }) => {
    client = _client
    const { data: { userId: _userId } } = await client.post('/auth/sign-up', TEST_USER)
    userId = _userId
    token = jwt.sign({ userId }, process.env.JWT_SECRET)
  }))

  context('when the user is not authenticated', () => {

    it('returns an Unauthorized error', async () => {
      const { status, data } = await client.post('/transactions', {
        amount: 100
      })
      expect(status).to.equal(401)
      expect(data).to.include({
        error: 'Unauthorized',
        message: 'Authentication required.'
      })
    })

  })

  context('when the user submits a malformed transaction', () => {

    it('returns a Bad Request error', async () => {
      const { status, data } = await client.post('/transactions', {
        amount: -1000
      }, {
        headers: { 'X-Access-Token': token }
      })
      expect(status).to.equal(400)
      expect(data).to.include({
        error: 'Bad Request',
        message: 'Validation error.'
      })
    })

  })

  context('when the user submits a valid transaction', () => {

    it('returns the created transaction', async () => {
      const { status, data } = await client.post('/transactions', {
        amount: 1000
      }, {
        headers: { 'X-Access-Token': token }
      })
      expect(status).to.equal(201)
      expect(data).to.have.structure({
        transactionId: Number,
        amount: Number,
        createdAt: String,
        updatedAt: String
      })
    })

  })

  context('when the request exceeds the client transaction limit', () => {

    beforeEach(inject(async ({ _knex }) => {
      /**
       * The limit is hard-coded in the application to 10,000.
       * Here are three example transactions that total 9,500.
       * A new transaction of 1,000 will cause the limit to be exceeded.
       */
      await _knex
        .insert([
          { amount: 3000, userId },
          { amount: 3000, userId },
          { amount: 3500, userId }
        ])
        .into('transactions')
    }))

    it('returns a Bad Request error', async () => {
      const { status, data } = await client.post('/transactions', {
        amount: 1000
      }, {
        headers: { 'X-Access-Token': token }
      })
      expect(status).to.equal(400)
      expect(data).to.include({
        error: 'Bad Request',
        message: 'Transaction limit exceeded.'
      })
    })

  })

})

describe('GET /transactions', () => {

  let client
  let token
  let userId

  beforeEach(inject(async ({ _client, _knex }) => {
    client = _client
    const { data: { userId: _userId } } = await client.post('/auth/sign-up', TEST_USER)
    userId = _userId
    token = jwt.sign({ userId }, process.env.JWT_SECRET)
    const transactions = [...Array(15)].map(_ => ({
      amount: 100, userId
    }))
    await _knex
      .insert(transactions)
      .into('transactions')
  }))

  context('when the user is not authenticated', () => {

    it('returns an Unauthorized error', async () => {
      const { status, data } = await client.get('/transactions')
      expect(status).to.equal(401)
      expect(data).to.include({
        error: 'Unauthorized',
        message: 'Authentication required.'
      })
    })

  })

  context('when the user does not specify a page', () => {

    it('returns the first ten transactions', async () => {
      const { status, data } = await client.get('/transactions', {
        headers: {
          'X-Access-Token': token
        }
      })
      expect(status).to.equal(200)
      expect(data).to.have.lengthOf(10)
      expect(data).to.have.structure([
        {
          amount: Number,
          createdAt: String
        }
      ])
    })

  })

  context('when the user specifies an invalid page', () => {

    it('returns a Bad Request error', async () => {
      const { status, data } = await client.get('/transactions?page=one', {
        headers: {
          'X-Access-Token': token
        }
      })
      expect(status).to.equal(400)
      expect(data).to.include({
        error: 'Bad Request',
        message: 'Validation error.'
      })
    })

  })

  context('when the user specifies the last available page', () => {

    it('returns the remaining transactions', async () => {
      /**
       * Only 15 transactions exist.
       * We should receive 5 on page 2.
       */
      const { status, data } = await client.get('/transactions?page=2', {
        headers: {
          'X-Access-Token': token
        }
      })
      expect(status).to.equal(200)
      expect(data).to.have.lengthOf(5)
      expect(data).to.have.structure([
        {
          amount: Number,
          createdAt: String
        }
      ])
    })

  })

})
