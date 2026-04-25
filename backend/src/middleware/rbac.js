/**
 * Role-Based Access Control Middleware
 * Restricts routes to specific user roles
 */
const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required.'
      });
    }

    if (!allowedRoles.includes(req.userRole)) {
      return res.status(403).json({
        success: false,
        message: `Access denied. Required role(s): ${allowedRoles.join(', ')}`
      });
    }

    next();
  };
};

// Pre-defined role checks
const isAdmin = authorize('admin');
const isShipper = authorize('shipper', 'admin');
const isTransporter = authorize('transporter', 'admin');
const isDriver = authorize('driver', 'admin');
const isShipperOrTransporter = authorize('shipper', 'transporter', 'admin');

module.exports = { authorize, isAdmin, isShipper, isTransporter, isDriver, isShipperOrTransporter };
