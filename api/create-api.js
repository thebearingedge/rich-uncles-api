import express from 'express'
import { errorHandler } from './util'
import authRouter from './auth-router'

export default function createApi({ knex, redis }) {
  return express()
    .use(express.json())
    .use('/auth', authRouter({ knex }))
    .use(errorHandler())
}
