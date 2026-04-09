const mongoose = require("mongoose");  
  
const userSchema = new mongoose.Schema(  
  {  
    firstName: { type: String, required: true, trim: true },  
    lastName: { type: String, required: true, trim: true },  
    age: { type: Number, required: true, min: 1 },  
    address: { type: String, required: true },  
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },  
    password: { type: String, required: true },  
    isAdmin: { type: Boolean, default: false }  
  },  
  { timestamps: true }  
);  
  
module.exports = mongoose.model("User", userSchema);