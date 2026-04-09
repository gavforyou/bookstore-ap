const Order = require("../models/Order");  
const Book = require("../models/Book");  
  
module.exports = {  
  listMyOrders: async (req, res) => {  
    try {  
      const orders = await Order.find({ userId: req.user.id }).sort({ createdAt: -1 });  
      return res.json({ orders });  
    } catch (err) {  
      return res.status(500).json({ message: "Server error", error: err.message });  
    }  
  },  
  
  createOrder: async (req, res) => {  
    try {  
      if (req.user.isAdmin) {  
        return res.status(403).json({ message: "Admins cannot create an order" });  
      }  
  
      const { books } = req.body;  
      if (!Array.isArray(books) || books.length === 0) {  
        return res.status(400).json({ message: "books must be a non-empty array" });  
      }  
  
      const detailedBooks = [];  
      for (const item of books) {  
        if (!item?.bookId) {  
          return res.status(400).json({ message: "Each book must have bookId" });  
        }  
  
        const b = await Book.findById(item.bookId);  
        if (!b) return res.status(404).json({ message: `Book not found: ${item.bookId}` });  
  
        detailedBooks.push({ bookId: b._id, title: b.title, author: b.author });  
      }  
  
      const order = await Order.create({  
        userId: req.user.id,  
        quantity: detailedBooks.length,  
        status: "pending",  
        books: detailedBooks,  
      });  
  
      return res.status(201).json({ message: "Order created", order });  
    } catch (err) {  
      return res.status(500).json({ message: "Server error", error: err.message });  
    }  
  },  
};