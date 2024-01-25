import db from '../config/database.js'
import cartRepository from './cart.js'

const order = {
  createOrder: async () => {
    const cart = await cartRepository.get()
    const cartItems = cart.items

    if (cartItems.length === 0) {
      throw new Error('Cart is empty')
    }

    const date = new Date().toISOString().slice(0, 10)
    const number = 'ORD-' + Math.random().toString(36)

    const [order] = await db.query('insert into orders set date = ?, number = ?,total = ?', [
      date,
      number,
      cart.cart_total
    ])

    cartItems.forEach(async (item) => {
      await db.query(
        'insert into order_items set order_id = ?, product_id = ?, quantity = ?, total = ?',
        [order.insertId, item.product_id, item.quantity, item.total]
      )
    })

    await cartRepository.empty()
  },

  get: async () => {
    const [rows] = await db.query('SELECT * FROM orders')
    return rows
  },

  find: async (id) => {
    const [rows] = await db.query('SELECT * FROM orders WHERE id = ?', [id])
    if (rows.length === 0) {
      throw new Error('Order not found')
    }

    const [items] = await db.query('SELECT * FROM order_items WHERE order_id = ?', [id])

    return {
      date: rows[0].date,
      number: rows[0].number,
      total: rows[0].total,
      created_at: rows[0].created_at,
      updated_at: rows[0].updated_at,
      items
    }
  }
}

export default order
