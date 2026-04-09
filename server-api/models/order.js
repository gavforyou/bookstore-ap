const mongoose = require("mongoose");  
  
const orderSchema = new mongoose.Schema(  
  {  
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },  
    quantity: { type: Number, required: true, min: 1 },  
    status: { type: String, default: "pending" },  
    books: [  
      {  
        bookId: { type: mongoose.Schema.Types.ObjectId, ref: "Book", required: true },  
        title: { type: String, required: true },  
        author: { type: String, required: true }  
      }  
    ]  
  },  
  { timestamps: true }  
);  
  
module.exports = mongoose.model("Order", orderSchema);