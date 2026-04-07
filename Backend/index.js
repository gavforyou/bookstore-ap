const express = require("express");

const mongoose = require("mongoose");

// CORS allow our backend app to be available to our frontend app
// It also allows us to control the app's Cross-Origin Resource Sharing settings.
const cors = require("cors");


/* s46 ACTIVITY SOLUTION START */
const userRoutes = require("./routes/user");
/* ACTIVITY SOLUTION END */



// Import all the routes for books
const booksRoutes = require("./routes/books");

// Import all the routes for orders
const ordersRoutes = require("./routes/orders");

// Import all the routes for cart
const cartRoutes = require("./routes/cart");



// [SECTION] Environment Setup
// This will allow us to process and use the variables stored in our .env file.
require('dotenv').config();



// Server app
const app = express();

// Port where server listens
// const port = 4000;


// [Section] Connection to MongoDB Compass
mongoose.connect(process.env.MONGODB_STRING);

// Creates an instance of a database
let db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error"));

db.once("open", () => console.log("We're connected to MongoDB Compass."));


// Server configuration
app.use(express.json());
app.use(express.urlencoded({extended:true}));

const corsOptions = {
    origin: ['http://localhost:8000', 'http://localhost:5173'], //Allo requests from this origin (This is the clients URL)
    // methods: ['GET', 'POST'], Allows specified HTTP methods // Optional only if you want to restrict the methods or operations that can be perform in your server app.
    // allowHeaders: ['Content-Type', 'Autorization'], //Allows specified header meta data // Optional only if your want to restrict headers configuration
    credentials: true,
    optionSuccessStatus: 200
};

// Pass the corsOptions as argument to the cors() method.
app.use(cors(corsOptions));


/* s46 ACTIVITY SOLUTION START */
app.use("/users", userRoutes);
/* ACTIVITY SOLUTION END */

// http://localhost:4000/books
app.use("/books", booksRoutes);

// http://localhost:4000/orders
app.use("/orders", ordersRoutes);

// http://localhost:4000/cart
app.use("/cart", cartRoutes);



if(require.main === module) {
    app.listen(process.env.PORT || 4000, () => console.log(`Server running at port ${process.env.PORT || 4000}`));
}

module.exports = {app, mongoose};
