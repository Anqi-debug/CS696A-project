const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    const userRole = req.user.role; // Assuming `req.user` contains the authenticated user's info

    if (!allowedRoles.includes(userRole)) {
      return res.status(403).json({ message: 'Access denied. You do not have the required permissions.' });
    }

    next(); // Proceed if the user's role is authorized
  };
};

module.exports = authorizeRoles;
