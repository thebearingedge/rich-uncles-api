import * as yup from 'yup'
import { validate } from '../util'

const validateSignUp = validate({
  body: yup.object().shape({
    email: yup.string().email().required(),
    password: yup.string().trim().required(),
    firstName: yup.string().trim().required(),
    lastName: yup.string().trim().required()
  })
})

const createUser = ({ users }) =>
  async ({ body }, res) => {
    const user = await users.create(body)
    res.status(201).json(user)
  }

export const handleSignUp = ({ users }) => [
  validateSignUp,
  createUser({ users })
]
