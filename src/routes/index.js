const express = require('express')
const router = express.Router()


const { getProducts, getProduct, addProduct, updateProduct, deleteProduct } = require('../controllers/product')
const { getToppings, getTopping } = require('../controllers/topping')
const { getUsers, getUser } = require('../controllers/user')

// ---------------- USERS --------------------- //
router.get('/users', getUsers)
router.get('/user/:id', getUser)
// router.delete('/user/:id', deleteUser)


// --------------- PRODUCTS ------------------- //
router.get('/products', getProducts)
router.get('/product/:id', getProduct)
router.post('/product', addProduct)
router.patch('/product/:id', updateProduct)
router.delete('/product/:id', deleteProduct)


// --------------- TOPPINGS ------------------- //
router.get('/toppings', getToppings)
router.get('/topping/:id', getTopping)


module.exports = router