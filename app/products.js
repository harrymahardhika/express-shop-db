import db from '../config/database.js'

const products = {
  get: async () => {
    const [rows] = await db.query('SELECT * FROM products')
    return rows
  },
  find: async (id) => {
    const [rows] = await db.query('SELECT * FROM products WHERE id = ?', [id])
    return rows[0]
  }
}

export default products
