import { inject, expect } from '../test'

describe('/auth/sign-up', () => {

  let client

  beforeEach(inject(({ _client }) => {
    client = _client
  }))

  context('when the user supplies valid account information', () => {

    it('returns the account information with a user id', async () => {
      const { status, data } = await client.post('/auth/sign-up', {
        firstName: 'Tim',
        lastName: 'Davis',
        email: 'contact@timdav.is',
        password: 'foobarbaz'
      })
      expect(status).to.equal(201)
      expect(data).to.have.structure({
        userId: Number,
        firstName: String,
        lastName: String,
        email: String,
        createdAt: String,
        updatedAt: String
      })
    })

  })

  context('when the user tries to sign up with a duplicate email', () => {

    it('returns a Bad Request error', async () => {
      const first = await client.post('/auth/sign-up', {
        firstName: 'Tim',
        lastName: 'Davis',
        email: 'contact@timdav.is',
        password: 'foobarbaz'
      })
      expect(first.status).to.equal(201)
      const second = await client.post('/auth/sign-up', {
        firstName: 'Tim',
        lastName: 'Davis',
        email: 'contact@timdav.is',
        password: 'foobarbaz'
      })
      expect(second.status).to.equal(400)
    })

  })

  context('when the user supplies invalid account information', () => {

    it('returns a Bad Request error', async () => {
      const { status, data } = await client.post('/auth/sign-up', {})
      expect(status).to.equal(400)
      expect(data).to.include({
        error: 'Bad Request',
        message: 'Validation error.'
      })
    })

  })

})
