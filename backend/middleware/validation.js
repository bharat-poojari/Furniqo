const { body, param, query, validationResult } = require('express-validator');

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }
  next();
};

// Product validation rules
const productValidation = [
  body('name').notEmpty().withMessage('Name is required'),
  body('slug').notEmpty().withMessage('Slug is required'),
  body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  body('category').notEmpty().withMessage('Category is required')
];

// Order validation rules
const orderValidation = [
  body('items').isArray().withMessage('Items must be an array'),
  body('items.*.productId').notEmpty().withMessage('Product ID is required'),
  body('items.*.quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
  body('subtotal').isFloat({ min: 0 }).withMessage('Subtotal must be positive'),
  body('total').isFloat({ min: 0 }).withMessage('Total must be positive')
];

// User validation rules
const userValidation = [
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
];

// Coupon validation rules
const couponValidation = [
  body('code').notEmpty().withMessage('Coupon code is required'),
  body('discount').isFloat({ min: 0 }).withMessage('Discount must be positive'),
  body('type').isIn(['percentage', 'fixed', 'freeShipping']).withMessage('Invalid coupon type')
];

module.exports = {
  validate,
  productValidation,
  orderValidation,
  userValidation,
  couponValidation
};