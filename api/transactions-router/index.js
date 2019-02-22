import Router from 'express-promise-router'
import * as middleware from './middleware'
import transactionsGateway from './transactions-gateway'

export default function transactionsRouter({ knex }) {
  const transactions = transactionsGateway({ knex })
  return new Router()
    .get('/', middleware.handleList({ transactions }))
    .post('/', middleware.handleCreate({ transactions }))
}
