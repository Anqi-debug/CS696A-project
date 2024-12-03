
const User = require('../models/User');
//import the database
//query the user info

exports.getUserInfo = async (req, res) => {
  const userId = req.user.id; // Assumes user ID is in req.user after authentication
  try {
      const user = await User.findOne({ _id: userId }).select('_id username email role');
      if (!user) {
          return res.status(404).send({message: 'User not found' });
      }
      res.status(200).json({
          message: 'User information retrieved successfully',
          data: user
      });
  } catch (err) {
      console.error(err);
      res.status(500).send({ message: 'Failed to retrieve user information' });
  }
};


exports.updateUserInfo = async (req, res) => {
  const userId = req.user.id; // Assumes user ID is available after authentication
  const { email, user_pic, role } = req.body; // Add any other fields you want to update

  try {
      const updatedUser = await User.findByIdAndUpdate(
          userId,
          { email, user_pic, role },
          { new: true, runValidators: true } // Return updated user and validate schema
      );

      if (!updatedUser) {
          return res.status(404).send({ message: 'User not found' });
      }

      res.status(200).json({
          status: 0,
          message: 'User information updated successfully',
          data: updatedUser
      });
  } catch (err) {
      console.error(err);
      res.status(500).send({ message: 'Failed to update user information' });
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
