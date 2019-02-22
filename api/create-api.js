import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import { errorHandler } from './util'
import authRouter from './auth-router'

export default function createApi({ knex }) {
  return express()
    .use(helmet())
    .use(cors())
    .use(express.json())
    .use('/auth', authRouter({ knex }))
    .use(errorHandler())
}
