import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import authRouter from './auth-router'
import { errorHandler, authorize } from './util'
import transactionsRouter from './transactions-router'

export default function createApi({ knex }) {
  return express()
    .use(helmet())
    .use(cors())
    .use(express.json())
    .use('/auth', authRouter({ knex }))
    .use(authorize)
    .use('/transactions', transactionsRouter({ knex }))
    .use(errorHandler())
}
