import boom from 'boom'
import * as yup from 'yup'
import { validate } from '../util'

const validateSignUp = validate({
  body: yup.object().shape({
    email: yup.string().trim().email().required(),
    password: yup.string().trim().required(),
    firstName: yup.string().trim().required(),
    lastName: yup.string().trim().required()
  })
})

const createUser = ({ users }) =>
  async (req, res) => {
    const { email, ...body } = req.body
    const exists = await users.exists({ email })
    if (exists) throw boom.badRequest(`The email address ${email} is already signed up.`)
    const user = await users.create({ email, ...body })
    res.status(201).json(user)
  }

export const handleSignUp = ({ users }) => [
  validateSignUp,
  createUser({ users })
]

const validateLogin = validate({
  body: yup.object().shape({
    email: yup.string().trim().email().required(),
    password: yup.string().trim().required()
  })
})

const authenticateUser = ({ users }) =>
  async (req, res) => {
    const { body: { email, password } } = req
    const { token } = await users.authenticate({ email, password })
    if (!token) throw boom.unauthorized('Invalid login.')
    res.status(201).json({ token })
  }

export const handleLogin = ({ users }) => [
  validateLogin,
  authenticateUser({ users })
]
