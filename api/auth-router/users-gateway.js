import bcrypt from 'bcrypt'

const ENCRYPTION_SALT_ROUNDS = parseInt(process.env.ENCRYPTION_SALT_ROUNDS)

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
      const password = await bcrypt.hash(unhashed, ENCRYPTION_SALT_ROUNDS)
      const [ created ] = await knex
        .insert({ password, ...user })
        .into('users')
        .returning([
          'user_id',
          'email',
          'firstName',
          'lastName',
          'createdAt',
          'updatedAt'
        ])
      return created
    }
  }
}
