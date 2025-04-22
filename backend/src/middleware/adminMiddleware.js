const isAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
      next();
    } else {
      res.status(403).json({ message: 'Admin access only' });
    }
  };
  
  const protect = require('./authMiddleware').protect;
  
  module.exports = { isAdmin, protect };