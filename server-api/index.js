require("dotenv").config();  
const express = require("express");  
const mongoose = require("mongoose");  
const cors = require("cors");  
  
const userRoutes = require("./routes/user");
const bookRoutes = require("./routes/book");  
const orderRoutes = require("./routes/order");  
  
const app = express();  
app.use(cors());  
app.use(express.json());  
  
app.use("/users", userRoutes);  
app.use("/books", bookRoutes);  
app.use("/orders", orderRoutes);  
  
mongoose  
  .connect(process.env.MONGODB_STRING)  
  .then(() => {  
    console.log("MongoDB connected");  
    app.listen(process.env.PORT || 4000, () =>  
      console.log(`Server running on port ${process.env.PORT || 4000}`)  
    );  
  })  
  .catch((err) => console.error(err));