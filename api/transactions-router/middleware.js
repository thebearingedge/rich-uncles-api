import boom from 'boom'
import * as yup from 'yup'
import { validate } from '../util'

const validateTransaction = validate({
  body: yup.object().shape({
    amount: yup.number().moreThan(0).required()
  })
})

const createTransaction = ({ transactions }) =>
  async (req, res) => {
    const { body: transaction, user: { userId } } = req
    const created = await transactions.create({
      ...transaction,
      userId
    })
    if (!created) throw boom.badRequest('Transaction limit exceeded.')
    res.status(201).json(created)
  }

export const handleCreate = ({ transactions }) => [
  validateTransaction,
  createTransaction({ transactions })
]

const validatePage = validate({
  query: yup.object().shape({
    page: yup.number().integer().moreThan(0)
  })
})

const listTransactions = ({ transactions }) =>
  async (req, res) => {
    const { query: { page }, user: { userId } } = req
    const transactionList = await transactions.findByUserId({ userId, page })
    res.json(transactionList)
  }

export const handleList = ({ transactions }) => [
  validatePage,
  listTransactions({ transactions })
]
