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
