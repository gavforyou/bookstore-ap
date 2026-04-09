const Book = require("../models/Book");  
  
module.exports = {  
  getAll: async (req, res) => {  
    try {  
      const books = await Book.find().sort({ createdAt: -1 });  
      return res.json({ books });  
    } catch (err) {  
      return res.status(500).json({ message: "Server error", error: err.message });  
    }  
  },  
  
  getOne: async (req, res) => {  
    try {  
      const book = await Book.findById(req.params.id);  
      if (!book) return res.status(404).json({ message: "Book not found" });  
      return res.json({ book });  
    } catch (err) {  
      return res.status(400).json({ message: "Invalid book id", error: err.message });  
    }  
  },  
  
  create: async (req, res) => {  
    try {  
      const { title, author, year, publisher } = req.body;  
      if (!title || !author || !year || !publisher) {  
        return res.status(400).json({ message: "All fields are required" });  
      }  
  
      const book = await Book.create({ title, author, year, publisher });  
      return res.status(201).json({ message: "Book created", book });  
    } catch (err) {  
      return res.status(500).json({ message: "Server error", error: err.message });  
    }  
  },  
  
  update: async (req, res) => {  
    try {  
      const updated = await Book.findByIdAndUpdate(req.params.id, req.body, {  
        new: true,  
        runValidators: true,  
      });  
  
      if (!updated) return res.status(404).json({ message: "Book not found" });  
      return res.json({ message: "Book updated", book: updated });  
    } catch (err) {  
      return res.status(400).json({ message: "Invalid request", error: err.message });  
    }  
  },  
  
  remove: async (req, res) => {  
    try {  
      const deleted = await Book.findByIdAndDelete(req.params.id);  
      if (!deleted) return res.status(404).json({ message: "Book not found" });  
      return res.json({ message: "Book deleted" });  
    } catch (err) {  
      return res.status(400).json({ message: "Invalid book id", error: err.message });  
    }  
  },  
};