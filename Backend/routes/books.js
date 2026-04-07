/* BOOKS ROUTES */
const express = require("express");
const booksController = require("../controllers/books");

// Validators
const {
    addBookValidator,
    updateBookValidator,
    searchBookValidator
} = require("../validators/bookValidator");

const { verify, verifyAdmin } = require("../auth");

//[SECTION] Routing Component
const router = express.Router();

//[SECTION] Route for creating a book (Admin only)
router.post("/", verify, verifyAdmin, addBookValidator, booksController.addBook);

//[SECTION] Route for retrieving all books (Admin only)
router.get("/all", verify, verifyAdmin, booksController.getAllBooks);

//[SECTION] Route for retrieving all active books
router.get("/", booksController.getAllActive);

//[SECTION] Route for retrieving a specific book
router.get("/:id", booksController.getBook);

//[SECTION] Route to search books by title
router.post("/search/title", searchBookValidator, booksController.searchBookByTitle);

//[SECTION] Route to search books by author
router.post("/search/author", searchBookValidator, booksController.searchBookByAuthor);

//[SECTION] Route to search books by category
router.post("/search/category", booksController.searchBookByCategory);

//[SECTION] Route to search books by price range
router.post("/search/price", booksController.searchBooksByPriceRange);

//[SECTION] Route for updating a book (Admin only)
router.patch("/:bookId", verify, verifyAdmin, updateBookValidator, booksController.updateBook);

//[SECTION] Route to archiving a book (Admin only)
router.patch("/:bookId/archive", verify, verifyAdmin, booksController.archiveBook);

//[SECTION] Route to activating a book (Admin only)
router.patch("/:bookId/activate", verify, verifyAdmin, booksController.activateBook);

//[SECTION] Export Route System
module.exports = router;
