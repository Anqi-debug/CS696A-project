// Middleware to check user roles
const roleAuth = (...allowedRoles) => {
  return (req, res, next) => {
    const role = req.user?.role; // Assuming the user's role is attached to the req.user object

    if (!allowedRoles.includes(role)) {
      return res.status(403).json({ message: 'Access denied. You do not have the required permissions.' });
    }

    next(); // Proceed to the next middleware/route handler if role is allowed
  };
};

module.exports = roleAuth;
