const isTechnician = (req, res, next) => {
    if (req.user && req.user.role === 'technician') {
      next();
    } else {
      res.status(403).json({ message: 'Technician access only' });
    }
  };
  
  module.exports = { isTechnician };