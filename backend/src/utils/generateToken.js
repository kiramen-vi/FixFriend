const jwt = require('jsonwebtoken');

const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: '20m', // ⏱ Token expires in 20 minutes
  });
};

module.exports = generateToken;
