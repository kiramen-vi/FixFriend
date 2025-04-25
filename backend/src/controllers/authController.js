const User = require('../models/User');
const generateToken = require('../utils/generateToken');

exports.registerUser = async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    console.log(" Registering user:", email);

    const newUser = new User({ name, email, password, role });
    await newUser.save(); //  Ensures pre-save hook is triggered

    res.status(201).json({
      token: generateToken(newUser._id, newUser.role),
      user: {
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (error) {
    console.error(" Registration error:", error.message);
    res.status(500).json({ message: 'Server error during registration' });
  }
};

exports.loginUser = async (req, res) => {
  const { email, password } = req.body;
  console.log(" Login attempt:", email);

  try {
    const user = await User.findOne({ email });

    if (!user) {
      console.log(" User not found:", email);
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    console.log(" Password in DB:", user.password);
    console.log(" Password entered:", password);

    const isMatch = await user.matchPassword(password);
    console.log(" Password match result:", isMatch);

    if (!isMatch) {
      console.log(" Incorrect password for:", email);
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    console.log(" Login successful:", user.email);

    res.json({
      token: generateToken(user._id, user.role),
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error(" Login error:", error.message);
    res.status(500).json({ message: 'Server error during login' });
  }
};
