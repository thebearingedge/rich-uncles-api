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
    }
  }
}
