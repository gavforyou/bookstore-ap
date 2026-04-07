/* BOOKS CONTROLLER */
const Book = require("../models/Book");
const { errorHandler } = require("../auth");

//[SECTION] Create a book
module.exports.addBook = (req, res) => {

    let newBook = new Book({
        title: req.body.title,
        author: req.body.author,
        isbn: req.body.isbn,
        description: req.body.description,
        price: req.body.price,
        quantity: req.body.quantity,
        category: req.body.category,
        publisher: req.body.publisher,
        publicationYear: req.body.publicationYear,
        imageUrl: req.body.imageUrl || null
    });

    // Add validation to check duplicate book based on ISBN
    Book.findOne({isbn: req.body.isbn})
    .then(existingBook => {
        if(existingBook) {
            return res.status(409).send({message: "Book with this ISBN already exists"});
        } else {
            return newBook.save().then(result => res.status(201).send({
                success: true,
                message: "Book added successfully",
                result: result
            }))
            .catch(error => errorHandler(error, req, res));
        }
    }).catch(error => errorHandler(error, req, res));
};

//[SECTION] Retrieve all books
module.exports.getAllBooks = (req, res) => {

    return Book.find({})
    .then(result => {
        if(result.length > 0) {
            return res.status(200).send(result);
        } else {
            return res.status(404).send({message: "No books found"});
        }
    })
    .catch(error => errorHandler(error, req, res));
};

//[SECTION] Retrieve all active books
module.exports.getAllActive = (req, res) => {

    return Book.find({isActive: true})
    .then(result => {
        if(result.length > 0) {
            return res.status(200).send(result);
        } else {
            return res.status(404).send({message: "No active books found"});
        }
    })
    .catch(error => errorHandler(error, req, res));
};

//[SECTION] Retrieve a specific book
module.exports.getBook = (req, res) => {

    return Book.findById(req.params.id)
    .then(result => {
        if(result) {
            return res.status(200).send(result);
        } else {
            return res.status(404).send({message: "Book not found"});
        }
    })
    .catch(error => errorHandler(error, req, res));
};

//[SECTION] Search books by title
module.exports.searchBookByTitle = (req, res) => {

    return Book.find({title: {$regex: req.body.title, $options: "i"}})
    .then(result => {
        if(result.length > 0) {
            return res.status(200).send(result);
        } else {
            return res.status(404).send({message: "No books found with that title"});
        }
    })
    .catch(error => errorHandler(error, req, res));
};

//[SECTION] Search books by author
module.exports.searchBookByAuthor = (req, res) => {

    return Book.find({author: {$regex: req.body.author, $options: "i"}})
    .then(result => {
        if(result.length > 0) {
            return res.status(200).send(result);
        } else {
            return res.status(404).send({message: "No books found by that author"});
        }
    })
    .catch(error => errorHandler(error, req, res));
};

//[SECTION] Search books by category
module.exports.searchBookByCategory = (req, res) => {

    return Book.find({category: req.body.category})
    .then(result => {
        if(result.length > 0) {
            return res.status(200).send(result);
        } else {
            return res.status(404).send({message: "No books found in that category"});
        }
    })
    .catch(error => errorHandler(error, req, res));
};

//[SECTION] Search books by price range
module.exports.searchBooksByPriceRange = (req, res) => {

    return Book.find({
        price: {
            $gte: req.body.minPrice,
            $lte: req.body.maxPrice
        }
    })
    .then(result => {
        if(result.length > 0) {
            return res.status(200).send(result);
        } else {
            return res.status(404).send({message: "No books found in that price range"});
        }
    })
    .catch(error => errorHandler(error, req, res));
};

//[SECTION] Update a book
module.exports.updateBook = (req, res) => {

    const updateData = {};
    if(req.body.title !== undefined) updateData.title = req.body.title;
    if(req.body.author !== undefined) updateData.author = req.body.author;
    if(req.body.description !== undefined) updateData.description = req.body.description;
    if(req.body.price !== undefined) updateData.price = req.body.price;
    if(req.body.quantity !== undefined) updateData.quantity = req.body.quantity;
    if(req.body.category !== undefined) updateData.category = req.body.category;
    if(req.body.publisher !== undefined) updateData.publisher = req.body.publisher;
    if(req.body.publicationYear !== undefined) updateData.publicationYear = req.body.publicationYear;

    return Book.findByIdAndUpdate(req.params.bookId, updateData, {new: true})
    .then(result => {
        if(result) {
            return res.status(200).send({
                success: true,
                message: "Book updated successfully",
                result: result
            });
        } else {
            return res.status(404).send({message: "Book not found"});
        }
    })
    .catch(error => errorHandler(error, req, res));
};

//[SECTION] Deactivate/Archive a book
module.exports.archiveBook = (req, res) => {

    return Book.findByIdAndUpdate(req.params.bookId, {isActive: false}, {new: true})
    .then(result => {
        if(result) {
            return res.status(200).send({
                success: true,
                message: "Book archived successfully",
                result: result
            });
        } else {
            return res.status(404).send({message: "Book not found"});
        }
    })
    .catch(error => errorHandler(error, req, res));
};

//[SECTION] Activate a book
module.exports.activateBook = (req, res) => {

    return Book.findByIdAndUpdate(req.params.bookId, {isActive: true}, {new: true})
    .then(result => {
        if(result) {
            return res.status(200).send({
                success: true,
                message: "Book activated successfully",
                result: result
            });
        } else {
            return res.status(404).send({message: "Book not found"});
        }
    })
    .catch(error => errorHandler(error, req, res));
};
