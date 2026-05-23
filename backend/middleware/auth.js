// middleware/auth.js

const jwt = require('jsonwebtoken');
const { getDb } = require('../config/database');

const JWT_SECRET = process.env.JWT_SECRET || 'furniqo_super_secret_key_change_in_production';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'furniqo_refresh_secret_key_change_in_production';

// Generate access token (short lived)
const generateAccessToken = (user) => {
  return jwt.sign(
    { 
      id: user._id, 
      email: user.email, 
      role: user.role,
      name: user.name
    },
    JWT_SECRET,
    { expiresIn: '15m' }
  );
};

// Generate refresh token (long lived)
const generateRefreshToken = (user) => {
  return jwt.sign(
    { id: user._id },
    JWT_REFRESH_SECRET,
    { expiresIn: '7d' }
  );
};

// Verify JWT token (for your products.js route)
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ 
      success: false, 
      message: 'Access denied. No token provided.' 
    });
  }
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        success: false, 
        message: 'Token expired',
        code: 'TOKEN_EXPIRED'
      });
    }
    return res.status(403).json({ 
      success: false, 
      message: 'Invalid token.' 
    });
  }
};

// Check if user is admin (for your products.js route)
const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ 
      success: false, 
      message: 'Admin access required' 
    });
  }
};

// Verify access token middleware (for other routes)
const protect = async (req, res, next) => {
  try {
    let token;
    
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to access this route'
      });
    }
    
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      const db = getDb();
      
      const user = await db.get(
        'SELECT _id, name, email, role, avatar, phone, address, city, state, zipCode, isVerified FROM users WHERE _id = ?',
        [decoded.id]
      );
      
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'User not found'
        });
      }
      
      req.user = user;
      next();
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        return res.status(401).json({
          success: false,
          message: 'Token expired',
          code: 'TOKEN_EXPIRED'
        });
      }
      return res.status(401).json({
        success: false,
        message: 'Invalid token'
      });
    }
  } catch (error) {
    next(error);
  }
};

// Admin only middleware
const admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({
      success: false,
      message: 'Admin access required'
    });
  }
};

// Optional auth (doesn't fail if no token)
const optionalAuth = async (req, res, next) => {
  try {
    let token;
    
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }
    
    if (token) {
      try {
        const decoded = jwt.verify(token, JWT_SECRET);
        const db = getDb();
        
        const user = await db.get(
          'SELECT _id, name, email, role FROM users WHERE _id = ?',
          [decoded.id]
        );
        
        if (user) {
          req.user = user;
        }
      } catch (error) {
        // Invalid token, just continue without user
      }
    }
    next();
  } catch (error) {
    next(error);
  }
};

// Store refresh token in database
const storeRefreshToken = async (userId, refreshToken, userAgent, ipAddress) => {
  const db = getDb();
  const expiresAt = Date.now() + (7 * 24 * 60 * 60 * 1000); // 7 days
  
  await db.run(
    `INSERT INTO user_sessions (user_id, refreshToken, userAgent, ipAddress, expiresAt)
     VALUES (?, ?, ?, ?, ?)`,
    [userId, refreshToken, userAgent || null, ipAddress || null, expiresAt]
  );
};

// Verify refresh token
const verifyRefreshToken = async (refreshToken) => {
  const db = getDb();
  
  try {
    const decoded = jwt.verify(refreshToken, JWT_REFRESH_SECRET);
    
    const session = await db.get(
      'SELECT * FROM user_sessions WHERE user_id = ? AND refreshToken = ? AND expiresAt > ?',
      [decoded.id, refreshToken, Date.now()]
    );
    
    if (!session) {
      return null;
    }
    
    const user = await db.get(
      'SELECT _id, name, email, role FROM users WHERE _id = ?',
      [decoded.id]
    );
    
    return user;
  } catch (error) {
    return null;
  }
};

// Revoke refresh token
const revokeRefreshToken = async (userId, refreshToken) => {
  const db = getDb();
  await db.run(
    'DELETE FROM user_sessions WHERE user_id = ? AND refreshToken = ?',
    [userId, refreshToken]
  );
};

// Revoke all user sessions
const revokeAllUserSessions = async (userId) => {
  const db = getDb();
  await db.run('DELETE FROM user_sessions WHERE user_id = ?', [userId]);
};

module.exports = {
  protect,
  admin,
  optionalAuth,
  verifyToken,        // Added for your products.js
  isAdmin,           // Added for your products.js
  generateAccessToken,
  generateRefreshToken,
  storeRefreshToken,
  verifyRefreshToken,
  revokeRefreshToken,
  revokeAllUserSessions,
  JWT_SECRET,
  JWT_REFRESH_SECRET
};