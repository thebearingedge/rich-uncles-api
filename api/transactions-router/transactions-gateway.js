import camelKeys from '../../common/camel-keys'

const MAXIMUM_TRANSACTIONS = 10000

export default function transactionsGateway({ knex }) {
  return {
    async create({ userId, amount }) {
      const { sum: totalTransactions } = await knex
        .sum('amount')
        .from('transactions')
        .where({ userId })
        .first()
      if (totalTransactions + amount > MAXIMUM_TRANSACTIONS) {
        return null
      }
      const [ created ] = await knex
        .insert({ userId, amount })
        .into('transactions')
        .returning([
          'transactionId',
          'amount',
          'createdAt',
          'updatedAt'
        ])
      return created
    },
    async findByUserId({ userId, page = 1 }) {
      const columns = [
        'amount',
        'createdAt'
      ]
      const offset = (page - 1) * 10
      const { rows: transactions } = await knex.raw(`
        select ??
          from transactions
         where user_id = ?
         order by created_at asc
        offset ? rows
         fetch first 10 rows only
      `, [columns, userId, offset])
      return camelKeys(transactions)
    }
  }
}
