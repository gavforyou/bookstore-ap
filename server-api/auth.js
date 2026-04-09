const jwt = require("jsonwebtoken");  
  
module.exports = {  
  verify: (req, res, next) => {  
    try {  
      const header = req.headers.authorization;  
      if (!header) {  
        return res.status(401).json({ message: "Missing Authorization header" });  
      }  
  
      const [type, token] = header.split(" ");  
      if (type !== "Bearer" || !token) {  
        return res.status(401).json({ message: "Invalid Authorization format" });  
      }  
  
      const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);  
      req.user = decoded;  
  
      return next();  
    } catch (err) {  
      return res.status(401).json({ message: "Invalid or expired token" });  
    }  
  },  
  
  requireAdmin: (req, res, next) => {  
    if (!req.user?.isAdmin) {  
      return res.status(403).json({ message: "Admin access required" });  
    }  
    return next();  
  },  
  
  requireNotAdmin: (req, res, next) => {  
    if (req.user?.isAdmin) {  
      return res.status(403).json({ message: "Admins cannot perform this action" });  
    }  
    return next();  
  },  
};