import Router from 'express-promise-router'
import * as middleware from './middleware'
import usersGateway from './users-gateway'

export default function authRouter({ knex }) {
  const users = usersGateway({ knex })
  return new Router()
    .post('/sign-up', middleware.handleSignUp({ users }))
}
