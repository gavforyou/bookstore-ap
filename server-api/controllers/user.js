const bcrypt = require("bcryptjs");  
const jwt = require("jsonwebtoken");  
const User = require("../models/User");  
  
const SALT_ROUNDS = 10;  
  
module.exports = {  
  register: async (req, res) => {  
    try {  
      const { firstName, lastName, age, address, email, password } = req.body;  
  
      if (!firstName || !lastName || !age || !address || !email || !password) {  
        return res.status(400).json({ message: "All fields are required" });  
      }  
  
      const existing = await User.findOne({ email: email.toLowerCase() });  
      if (existing) return res.status(409).json({ message: "Email already registered" });  
  
      const hashed = await bcrypt.hash(password, SALT_ROUNDS);  
  
      const user = await User.create({  
        firstName,  
        lastName,  
        age,  
        address,  
        email: email.toLowerCase(),  
        password: hashed,  
      });  
  
      return res.status(201).json({  
        message: "User registered successfully",  
        user: {  
          id: user._id,  
          firstName: user.firstName,  
          lastName: user.lastName,  
          age: user.age,  
          address: user.address,  
          email: user.email,  
          isAdmin: user.isAdmin,  
        },  
      });  
    } catch (err) {  
      return res.status(500).json({ message: "Server error", error: err.message });  
    }  
  },  
  
  login: async (req, res) => {  
    try {  
      const { email, password } = req.body;  
      if (!email || !password) {  
        return res.status(400).json({ message: "Email and password required" });  
      }  
  
      const user = await User.findOne({ email: email.toLowerCase() });  
      if (!user) return res.status(401).json({ message: "Invalid credentials" });  
  
      const ok = await bcrypt.compare(password, user.password);  
      if (!ok) return res.status(401).json({ message: "Invalid credentials" });  
  
      const token = jwt.sign(  
        { id: user._id, email: user.email, isAdmin: user.isAdmin },  
        process.env.JWT_SECRET_KEY,  
        { expiresIn: "7d" }  
      );  
  
      return res.json({ message: "Login successful", token });  
    } catch (err) {  
      return res.status(500).json({ message: "Server error", error: err.message });  
    }  
  },  
  
  profile: async (req, res) => {  
    try {  
      const user = await User.findById(req.user.id).select("-password");  
      if (!user) return res.status(404).json({ message: "User not found" });  
      return res.json({ user });  
    } catch (err) {  
      return res.status(500).json({ message: "Server error", error: err.message });  
    }  
  },  
  
  updateAdmin: async (req, res) => {  
    try {  
      const { userId } = req.body;  
      if (!userId) return res.status(400).json({ message: "userId is required" });  
  
      const updated = await User.findByIdAndUpdate(  
        userId,  
        { isAdmin: true },  
        { new: true }  
      ).select("-password");  
  
      if (!updated) return res.status(404).json({ message: "User not found" });  
  
      return res.json({ message: "User updated as admin successfully", user: updated });  
    } catch (err) {  
      return res.status(500).json({ message: "Server error", error: err.message });  
    }  
  },  
};