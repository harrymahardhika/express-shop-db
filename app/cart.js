import db from '../config/database.js'

const cart = {
  addToCart: async (productId, quantity) => {
    const [productExists] = await db.query('select * from products where id = ?', [productId])

    if (productExists.length === 0) {
      throw new Error('Product not found')
    }

    // check if product is in stock
    if (productExists[0].in_stock === 0) {
      throw new Error('Product is out of stock')
    }

    const total = productExists[0].price * quantity

    // check if product is already in cart
    const [productInCart] = await db.query('select * from cart where product_id = ?', [productId])

    if (!productInCart[0]) {
      // if product is not in cart, insert it
      await db.query('insert into cart set product_id = ?, quantity = ?, total = ?', [
        productId,
        quantity,
        total
      ])
    } else {
      // if product is in cart, update quantity
      await db.query('update cart set quantity = ?, total = ? where product_id = ?', [
        quantity,
        total,
        productId
      ])
    }
  },

  get: async () => {
    const query = `select cart.*, products.name, products.price
		from cart join products on cart.product_id = products.id`

    const [rows] = await db.query(query)

    let cartTotal = 0

    rows.forEach((row) => {
      cartTotal += row.total
    })

    return {
      cart_total: cartTotal,
      items: rows
    }
  },

  delete: async (id) => {
    const [cartItem] = await db.query('delete from cart where id = ?', [id])

    if (cartItem.affectedRows === 0) {
      throw new Error('Product not found in cart')
    }
  },

  empty: async () => {
    await db.query('delete from cart')
  }
}

export default cart
