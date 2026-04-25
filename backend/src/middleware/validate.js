const { validationResult, body, param, query } = require('express-validator');

/**
 * Processes validation results and returns errors if any
 */
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map(err => ({
        field: err.path,
        message: err.msg,
        value: err.value
      }))
    });
  }
  next();
};

// ============================================
// AUTH VALIDATORS
// ============================================

const registerRules = [
  body('phone').isMobilePhone('en-IN').withMessage('Valid Indian phone number required'),
  body('first_name').trim().isLength({ min: 2, max: 100 }).withMessage('First name (2-100 chars) required'),
  body('role').isIn(['shipper', 'transporter', 'driver']).withMessage('Valid role required'),
  body('email').optional().isEmail().withMessage('Valid email required'),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/).withMessage('Password must include uppercase, lowercase, and number'),
];

const loginRules = [
  body('phone').optional().isMobilePhone('en-IN'),
  body('email').optional().isEmail(),
  body('password').optional().isLength({ min: 1 }),
  body('otp').optional().isLength({ min: 6, max: 6 }),
];

// ============================================
// SHIPMENT VALIDATORS
// ============================================

const createShipmentRules = [
  body('pickup_address').trim().notEmpty().withMessage('Pickup address required'),
  body('pickup_lat').isDecimal().withMessage('Valid pickup latitude required'),
  body('pickup_lng').isDecimal().withMessage('Valid pickup longitude required'),
  body('drop_address').trim().notEmpty().withMessage('Drop address required'),
  body('drop_lat').isDecimal().withMessage('Valid drop latitude required'),
  body('drop_lng').isDecimal().withMessage('Valid drop longitude required'),
  body('weight_kg').isFloat({ min: 0.1 }).withMessage('Weight must be positive'),
  body('vehicle_type_required').isIn(['mini_truck', 'lcv', 'hcv', 'trailer', 'container', 'tanker', 'refrigerated'])
    .withMessage('Valid vehicle type required'),
  body('material_type').optional().trim(),
  body('payment_method').optional().isIn(['upi', 'card', 'wallet', 'cod', 'bank_transfer']),
];

// ============================================
// VEHICLE VALIDATORS
// ============================================

const addVehicleRules = [
  body('registration_number').trim().notEmpty().withMessage('Registration number required'),
  body('vehicle_type').isIn(['mini_truck', 'lcv', 'hcv', 'trailer', 'container', 'tanker', 'refrigerated'])
    .withMessage('Valid vehicle type required'),
  body('capacity_tons').isFloat({ min: 0.1 }).withMessage('Capacity must be positive'),
];

// ============================================
// PAYMENT VALIDATORS
// ============================================

const createPaymentRules = [
  body('shipment_id').isUUID().withMessage('Valid shipment ID required'),
  body('method').isIn(['upi', 'card', 'wallet', 'cod', 'bank_transfer']).withMessage('Valid payment method required'),
];

// ============================================
// COMMON VALIDATORS
// ============================================

const paginationRules = [
  query('page').optional().isInt({ min: 1 }).toInt(),
  query('limit').optional().isInt({ min: 1, max: 100 }).toInt(),
];

const uuidParam = [
  param('id').isUUID().withMessage('Valid ID required'),
];

module.exports = {
  validate,
  registerRules,
  loginRules,
  createShipmentRules,
  addVehicleRules,
  createPaymentRules,
  paginationRules,
  uuidParam
};
