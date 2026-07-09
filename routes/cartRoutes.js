const express = require('express');
const router = express.Router();
const { addToCart, checkoutCart, clearCart } = require('../controllers/cartController');

router.post('/add', addToCart);
router.post('/checkout', checkoutCart);
router.post('/clear', clearCart);

module.exports = router;
