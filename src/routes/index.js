const express = require('express')
const router = express.Router()

const { uploadFile } = require('../middlewares/upload')
const { auth } = require('../middlewares/auth');

const { register, login, checkAuth } = require('../controllers/auth');
const { getProducts, getProduct, addProduct, updateProduct, deleteProduct } = require('../controllers/product')
const { getToppings, getTopping, addTopping, updateTopping, deleteTopping } = require('../controllers/topping')
const { getUsers, getUser, deleteUser, restoreUser } = require('../controllers/user')
const { getTransactions, getTransaction, addTransaction, updateTransaction, uploadPayment } = require('../controllers/transaction')

// ---------------------- AUTH ------------------------ //
router.post('/auth/register', register)
router.post('/auth/login', login)
router.get('/auth', auth, checkAuth)

// --------------------- USERS --------------------- //
router.get('/users', auth, getUsers)
router.get('/user', auth, getUser)
router.delete('/user/:id', auth, deleteUser)
router.post('/user/:id', auth, restoreUser)


// ------------------- PRODUCTS ------------------- //
router.get('/products', getProducts)
router.get('/product/:id', auth, getProduct)
router.post('/product', auth, uploadFile('image'), addProduct)
router.patch('/product/:id', auth, updateProduct)
router.delete('/product/:id', auth, deleteProduct)


// ------------------- TOPPINGS ------------------- //
router.get('/toppings', auth, getToppings)
router.get('/topping/:id', auth, getTopping)
router.post('/topping', auth, uploadFile('toppingImage'), addTopping)
router.patch('/topping/:id', auth, updateTopping)
router.delete('/topping/:id', auth, deleteTopping)


// ----------------- TRANSACTIONS ---------------- //
router.get('/transactions', auth, getTransactions)
router.get('/transaction/:id', auth, getTransaction)
router.post('/transaction', auth, addTransaction)
router.patch('/transaction/:id', auth, updateTransaction)
router.patch('/transaction/payment/:id', auth, uploadFile('attachment'), uploadPayment)

module.exports = router