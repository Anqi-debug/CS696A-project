const User = require('../models/user');
const Donation = require('../models/donation');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../config/config');

// Registration function
exports.registration = async (req, res) => {
  const { username, password, email, role } = req.body;

  try {
      // Check for existing username and email in parallel
      const [existingUser, existingEmail] = await Promise.all([
          User.findOne({ username }),
          User.findOne({ email })
      ]);

      if (existingUser) {
          return res.status(400).json({ message: 'Username is already registered. Please use a different username.' });
      }

      if (existingEmail) {
          return res.status(400).json({ message: 'Email is already registered. Please use a different email.' });
      }

      // Hash the password asynchronously
      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = new User({
          username,
          email,
          password: hashedPassword,
          role
      });

      const result = await newUser.save();

      if (!result) {
          return res.status(500).json({ message: 'Registration failed, please try again later.' });
      }
      
      const userWithoutPassword = { ...result.toObject(), password: undefined };

      res.status(201).json({
          message: 'Registration successful.',
          user: userWithoutPassword,
      });

  } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error during registration.' });
  }
};

// Login function
exports.login = async (req, res) => {
  const { username, email, password } = req.body;

  try {
      // Search for the user by username or email
      const user = await User.findOne({ email });

      if (!user) {
          return res.status(404).json({ error: 'User not found.' });
      }

      // Use bcrypt.compare to verify the password asynchronously
      const isPasswordCorrect = await bcrypt.compare(password, user.password);

      if (!isPasswordCorrect) {
          return res.status(401).json({ error: 'Invalid credentials.' });
      }

      // Remove password field from the user object
      const userWithoutPassword = { ...user.toObject(), password: '', role: user.role };

      // Generate a token with a payload and expiration
      const tokenStr = jwt.sign(userWithoutPassword, config.jwtSecretKey, { expiresIn: config.expireIn });

      res.status(200).json({
          message: 'Login successful',
          user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role
          },
          token: tokenStr
      });

  } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Server error during login.' });
  }
};

exports.changePassword = async (req, res) => {
  const { currentPassword, newPassword, confirmPassword } = req.body;
  const userId = req.user.id; // Assumes user ID is available after authentication

  try {
      // Step 1: Validate new password and confirmation match
      if (newPassword !== confirmPassword) {
          return res.status(400).json({ message: 'New password and confirmation do not match' });
      }

      // Step 2: Find the user by their ID
      const user = await User.findById(userId);
      if (!user) {
          return res.status(404).json({ message: 'User not found' });
      }

      // Step 3: Verify the current password
      const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
      if (!isCurrentPasswordValid) {
          return res.status(400).json({  message: 'Current password is incorrect' });
      }

      // Step 4: Hash the new password
      const hashedNewPassword = await bcrypt.hash(newPassword, 10);

      // Step 5: Update the user's password
      user.password = hashedNewPassword;
      await user.save();

      // Step 6: Respond with success
      res.status(200).json({message: 'Password changed successfully'});
  } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Failed to change the password' });
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
      const user = await User.findById(userId);
      if (!user) return res.status(404).json({ error: 'User not found' });
      if (user.role !== 'creator') return res.status(403).json({ error: 'Only creators can view portfolios' });
  
      res.status(200).json({ user });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };
  

// Create a new user
exports.createUser = async (req, res) => {
    try {
        const {
            username,
            email,
            role,
            createdProjects,
            donations,
            recurringDonations,
            socialMediaLink,
            supporterLevel,
            notifications,
        } = req.body;

        // Validate input fields
        if (!username || !email || !role) {
            return res.status(400).json({ message: 'Name, email, and role are required.' });
        }

        const newUser = new User({
            username,
            email,
            role,
            createdProjects: createdProjects || [],
            donations: donations || [],
            recurringDonations: recurringDonations || [],
            socialMediaLink: socialMediaLink || '',
            supporterLevel: supporterLevel || 'Basic',
            notifications: notifications || [],
        });

        const savedUser = await newUser.save();

        res.status(201).json({
            message: 'User created successfully',
            user: savedUser,
        });
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({
            message: 'Error creating user',
            error: error.message,
        });
    }
};

// Add a recurring donation
exports.addRecurringDonation = async (req, res) => {
    try {
        const { userId, amount, frequency, projectId } = req.body;

        if (!userId || !amount || !frequency || !projectId) {
            return res.status(400).json({ success: false, message: 'Missing required fields' });
        }

        const donationData = {
            donorId: userId,
            amount,
            frequency,
            projectId,
            isActive: true,
            nextPaymentDate: new Date(),
            lastPaymentDate: new Date(),
        };

        const newDonation = new Donation(donationData);
        const savedDonation = await newDonation.save();

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        user.recurringDonations.push(savedDonation._id);
        await user.save();

        res.status(200).json({
            success: true,
            message: 'Recurring donation added successfully',
        });
    } catch (error) {
        console.error('Error adding recurring donation:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Fetch user with populated recurring donations
exports.getDonationsUserById = async (req, res) => {
    try {
        const { userId } = req.params;

        const user = await User.findById(userId)
            .populate('recurringDonations')
            .exec();

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        res.status(200).json({
            success: true,
            user,
        });
    } catch (error) {
        console.error('Error fetching user with recurring donations:', error);
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};