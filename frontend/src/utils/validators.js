// src/utils/validators.js

export const required = (value, fieldName = 'This field') => {
  if (!value || (typeof value === 'string' && !value.trim())) {
    return `${fieldName} is required`;
  }
  return '';
};

export const minLength = (value, min, fieldName = 'This field') => {
  if (value && value.length < min) {
    return `${fieldName} must be at least ${min} characters`;
  }
  return '';
};

export const maxLength = (value, max, fieldName = 'This field') => {
  if (value && value.length > max) {
    return `${fieldName} must not exceed ${max} characters`;
  }
  return '';
};

export const validateEmail = (email) => {
  if (!email) return 'Email is required';
  const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!re.test(email)) return 'Please enter a valid email address';
  return '';
};

export const email = (value) => {
  if (!value) return '';
  const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!re.test(value)) return 'Please enter a valid email address';
  return '';
};

export const validatePassword = (password) => {
  if (!password) return 'Password is required';
  if (password.length < 8) return 'Password must be at least 8 characters';
  if (!/[A-Z]/.test(password)) return 'Password must contain at least one uppercase letter';
  if (!/[a-z]/.test(password)) return 'Password must contain at least one lowercase letter';
  if (!/[0-9]/.test(password)) return 'Password must contain at least one number';
  return '';
};

export const password = (value) => {
  if (!value) return '';
  if (value.length < 8) return 'Password must be at least 8 characters';
  if (!/[A-Z]/.test(value)) return 'Must contain an uppercase letter';
  if (!/[a-z]/.test(value)) return 'Must contain a lowercase letter';
  if (!/[0-9]/.test(value)) return 'Must contain a number';
  return '';
};

export const confirmPassword = (value, compareValue) => {
  if (!value) return '';
  if (value !== compareValue) return 'Passwords do not match';
  return '';
};

export const validateName = (name) => {
  if (!name) return 'Name is required';
  if (name.length < 2) return 'Name must be at least 2 characters';
  return '';
};

export const validatePhone = (phone) => {
  if (!phone) return '';
  const re = /^\+?[\d\s\-().]{10,15}$/;
  if (!re.test(phone)) return 'Please enter a valid phone number';
  return '';
};

export const phone = (value) => {
  if (!value) return '';
  const re = /^\+?[\d\s\-().]{10,15}$/;
  if (!re.test(value)) return 'Please enter a valid phone number';
  return '';
};

export const validateAddress = (address) => {
  if (!address) return 'Address is required';
  if (address.length < 10) return 'Please enter a complete address';
  return '';
};
export const validateZipCode = (zip) => {
  if (!zip) return 'ZIP code is required';

  const normalized = String(zip).replace(/\s+/g, ''); // remove all spaces

  const re = /^\d{6}$/;
  if (!re.test(normalized)) return 'Please enter a valid ZIP code';

  return '';
};

export const creditCard = (value) => {
  if (!value) return '';
  const cleaned = value.replace(/\s/g, '');
  if (!/^\d{16}$/.test(cleaned)) return 'Please enter a valid 16-digit card number';
  return '';
};

export const cvv = (value) => {
  if (!value) return '';
  const cleaned = value.replace(/\s/g, '');
  if (!/^\d{3,4}$/.test(cleaned)) return 'Please enter a valid CVV';
  return '';
};

export const expiryDate = (value) => {
  if (!value) return '';
  const re = /^(0[1-9]|1[0-2])\/([0-9]{2})$/;
  if (!re.test(value)) return 'Please enter a valid expiry date (MM/YY)';
  const [month, year] = value.split('/');
  const expiry = new Date(2000 + parseInt(year), parseInt(month), 0);
  if (expiry < new Date()) return 'Card has expired';
  return '';
};

export const url = (value) => {
  if (!value) return '';
  try {
    new URL(value);
    return '';
  } catch {
    return 'Please enter a valid URL';
  }
};