import boom from 'boom'
import jwt from 'jsonwebtoken'

export default function authorize(req, res, next) {
  const token = req.get('x-access-token')
  if (!token) throw boom.unauthorized('Authentication required.')
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET)
    next()
  }
  catch (_) {
    throw boom.unauthorized('Invalid or expired access token.')
  }
}
