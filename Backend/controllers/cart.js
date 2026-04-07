const Cart = require('../models/Cart');
const Book = require('../models/Book');
const { errorHandler } = require('../auth');

// Get user's cart
module.exports.getCart = async (req, res) => {
    try {
        const userId = req.user.id;
        let cart = await Cart.findOne({ userId }).populate('items.bookId');
        
        if (!cart) {
            cart = new Cart({ userId, items: [] });
            await cart.save();
        }
        
        res.status(200).json({
            message: 'Cart retrieved successfully',
            cart: cart
        });
    } catch (error) {
        errorHandler(error, req, res);
    }
};

// Add item to cart
module.exports.addToCart = async (req, res) => {
    try {
        const userId = req.user.id;
        const { bookId, quantity } = req.body;

        // Validate book exists and has stock
        const book = await Book.findById(bookId);
        if (!book) {
            return res.status(404).json({ message: 'Book not found' });
        }

        if (book.quantity < quantity) {
            return res.status(400).json({ message: 'Insufficient stock' });
        }

        let cart = await Cart.findOne({ userId });
        if (!cart) {
            cart = new Cart({ userId, items: [] });
        }

        // Check if item already exists
        const existingItem = cart.items.find(item => item.bookId.toString() === bookId);
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            cart.items.push({
                bookId,
                title: book.title,
                author: book.author,
                price: book.price,
                quantity
            });
        }

        cart.updatedAt = new Date();
        await cart.save();

        res.status(201).json({
            message: 'Item added to cart',
            cart: await Cart.findById(cart._id).populate('items.bookId')
        });
    } catch (error) {
        errorHandler(error, req, res);
    }
};

// Update item quantity in cart
module.exports.updateCartItem = async (req, res) => {
    try {
        const userId = req.user.id;
        const { bookId, quantity } = req.body;

        const cart = await Cart.findOne({ userId });
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        const item = cart.items.find(item => item.bookId.toString() === bookId);
        if (!item) {
            return res.status(404).json({ message: 'Item not in cart' });
        }

        // Validate stock
        const book = await Book.findById(bookId);
        if (book.quantity < quantity) {
            return res.status(400).json({ message: 'Insufficient stock' });
        }

        item.quantity = quantity;
        cart.updatedAt = new Date();
        await cart.save();

        res.status(200).json({
            message: 'Cart item updated',
            cart: await Cart.findById(cart._id).populate('items.bookId')
        });
    } catch (error) {
        errorHandler(error, req, res);
    }
};

// Remove item from cart
module.exports.removeFromCart = async (req, res) => {
    try {
        const userId = req.user.id;
        const { bookId } = req.body;

        const cart = await Cart.findOne({ userId });
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        cart.items = cart.items.filter(item => item.bookId.toString() !== bookId);
        cart.updatedAt = new Date();
        await cart.save();

        res.status(200).json({
            message: 'Item removed from cart',
            cart: await Cart.findById(cart._id).populate('items.bookId')
        });
    } catch (error) {
        errorHandler(error, req, res);
    }
};

// Clear entire cart
module.exports.clearCart = async (req, res) => {
    try {
        const userId = req.user.id;

        const cart = await Cart.findOne({ userId });
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        cart.items = [];
        cart.updatedAt = new Date();
        await cart.save();

        res.status(200).json({
            message: 'Cart cleared',
            cart: cart
        });
    } catch (error) {
        errorHandler(error, req, res);
    }
};
