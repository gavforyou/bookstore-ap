const express = require('express');
const router = express.Router();

const cartController = require('../controllers/cart');
const { verify } = require('../auth');

// Get user's cart
router.get('/', verify, cartController.getCart);

// Add item to cart
router.post('/', verify, cartController.addToCart);

// Update item quantity in cart
router.patch('/', verify, cartController.updateCartItem);

// Remove item from cart
router.delete('/', verify, cartController.removeFromCart);

// Clear entire cart
router.delete('/clear', verify, cartController.clearCart);

module.exports = router;
