import express from 'express'
import productRepository from './app/products.js'
import cartRepository from './app/cart.js'

const app = express()

app.use(express.json())

app.get('/products', async (req, res) => {
  const products = await productRepository.get()
  res.json(products)
})

app.post('/cart', async (req, res) => {
  if (!req.body.product_id || !req.body.quantity) {
    res.status(400).json({
      error: 'product_id and quantity are required'
    })

    return
  }

  try {
    await cartRepository.addToCart(req.body.product_id, req.body.quantity)

    res.json({
      message: 'Product added to cart'
    })
  } catch (error) {
    res.status(400).json({
      error: error.message
    })
  }
})

app.get('/cart', async (req, res) => {
  const cart = await cartRepository.get()
  res.json(cart)
})

app.delete('/cart/:id', async (req, res) => {
  try {
    await cartRepository.delete(req.params.id)

    res.json({
      message: 'Product removed from cart'
    })
  } catch (error) {
    res.status(400).json({
      error: error.message
    })
  }
})

app.delete('/cart', async (req, res) => {
  await cartRepository.empty()

  res.json({
    message: 'Cart emptied'
  })
})

export default app
