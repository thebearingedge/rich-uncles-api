import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

export default function usersGateway({ knex }) {
  return {
    async exists({ email }) {
      const { rows: [{ exists }] } = await knex.raw(`
        select exists(
          select user_id
            from users
           where email = ?
        ) as "exists"
      `, [email])
      return exists
    },
    async create({ password: unhashed, ...user }) {
      const password = await bcrypt.hash(
        unhashed,
        parseInt(process.env.ENCRYPTION_SALT_ROUNDS, 10)
      )
      const [ created ] = await knex
        .insert({ password, ...user })
        .into('users')
        .returning([
          'userId',
          'email',
          'firstName',
          'lastName',
          'createdAt',
          'updatedAt'
        ])
      return created
    },
    async authenticate({ email, password: unhashed }) {
      const user = await knex
        .select(['userId', 'password'])
        .from('users')
        .where({ email })
        .first()
      if (!user) return { token: null }
      const { userId, password: hashed } = user
      const passwordsMatch = await bcrypt.compare(unhashed, hashed)
      if (!passwordsMatch) return { token: null }
      return { token: jwt.sign({ userId }, process.env.JWT_SECRET) }
    }
  }
}
