const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Register a new user
exports.registerUser = async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create a new user
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role
    });

    // Save the user to the database
    await newUser.save();

    // Generate a JWT token (optional)
    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET is not defined');
    }
    const token = jwt.sign({ id: newUser._id, role: newUser.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role
      },
      token
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update creator portfolio
exports.updatePortfolio = async (req, res) => {
  const { userId } = req.params;
  const { bio, portfolioItems, socialMediaLinks } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: 'User not found' });
    if (user.role !== 'creator') return res.status(403).json({ error: 'Only creators can update portfolios' });

    user.bio = bio || user.bio;
    user.portfolioItems = portfolioItems || user.portfolioItems;
    user.socialMediaLinks = socialMediaLinks || user.socialMediaLinks;
    user.updatedAt = Date.now();

    await user.save();
    res.status(200).json({ message: 'Portfolio updated successfully', user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Fetch creator portfolio
exports.getPortfolio = async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId).select('name bio portfolioItems socialMediaLinks createdProjects');
    if (!user) return res.status(404).json({ error: 'User not found' });

    res.status(200).json({ user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
