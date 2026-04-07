/* BOOK MODEL */
const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Book Title is Required']
    },
    author: {
        type: String,
        required: [true, 'Author Name is Required']
    },
    isbn: {
        type: String,
        required: [true, 'ISBN is Required'],
        unique: true
    },
    description: {
        type: String,
        required: [true, 'Book Description is Required']
    },
    price: {
        type: Number,
        required: [true, 'Book Price is Required']
    },
    quantity: {
        type: Number,
        required: [true, 'Stock Quantity is Required'],
        default: 0
    },
    category: {
        type: String,
        required: [true, 'Book Category is Required']
    },
    publisher: {
        type: String,
        required: false
    },
    publicationYear: {
        type: Number,
        required: false
    },
    imageUrl: {
        type: String,
        required: false,
        default: null
    },
    isActive: {
        type: Boolean,
        default: true
    },
    createdOn: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Book', bookSchema);
