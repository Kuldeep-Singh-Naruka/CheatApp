const User = require("../model/user.model");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Registration
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const newUser = new User({ name, email, password });
    await newUser.save();
    res.status(201).send({ message: 'User registered successfully' });
  } catch (error) {
    if (error.code === 11000 && error.keyPattern && error.keyPattern.email) {
      return res.status(400).send({ message: 'Email already exists' });
    }
    res.status(500).send({ message: error.message });
  }
};

// Login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).send({ message: 'Invalid email or password' });
    }
    const isPasswordValid = await user.isValidPassword(password);
    if (!isPasswordValid) {
      return res.status(400).send({ message: 'Invalid email or password' });
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(200).send({ token });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

// Logout
exports.logout = (req, res) => {
  res.status(200).send({ message: 'Logged out successfully.' });
};

// Update
exports.update = async (req, res) => {
  try {
    const { id } = req.user;
    const { name, email, password } = req.body;
    const updatedData = { name, email };
    if (password) {
      updatedData.password = await bcrypt.hash(password, 10);
    }
    const updatedUser = await User.findByIdAndUpdate(id, updatedData, { new: true });
    if (!updatedUser) {
      return res.status(404).send({ message: 'User not found' });
    }
    res.status(200).send({ message: 'User updated successfully', user: updatedUser });
  } catch (error) {
    if (error.code === 11000 && error.keyPattern && error.keyPattern.email) {
      return res.status(400).send({ message: 'Email already exists' });
    }
    res.status(500).send({ message: error.message });
  }
};

// User-info
exports.getUserInfo = async (req, res) => {
  try {
    const { id } = req.user;
    const user = await User.findById(id).select('-password');
    
    if (!user) {
      return res.status(404).send({ message: 'User not found' });
    }
    res.status(200).send({ user });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};


