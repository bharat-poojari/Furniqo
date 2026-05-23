// routes/users.js

const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const crypto = require('crypto');
const { getDb } = require('../config/database');
const { 
  protect, 
  admin, 
  generateAccessToken, 
  generateRefreshToken,
  storeRefreshToken,
  verifyRefreshToken,
  revokeRefreshToken,
  revokeAllUserSessions
} = require('../middleware/auth');

// Helper function to generate user ID
const generateUserId = () => {
  return 'user_' + Date.now() + '_' + Math.random().toString(36).substring(2, 8);
};

// @desc    Register new user
// @route   POST /api/users/register
// @access  Public
router.post('/register', async (req, res, next) => {
  try {
    const { name, email, password, phone, address, city, state, zipCode } = req.body;
    const db = getDb();
    
    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, email and password'
      });
    }
    
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters'
      });
    }
    
    // Check if user already exists
    const existingUser = await db.get('SELECT * FROM users WHERE email = ?', [email.toLowerCase()]);
    
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email'
      });
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');
    
    // Create user
    const userId = generateUserId();
    const now = new Date().toISOString();
    
    await db.run(`
      INSERT INTO users (
        _id, name, email, password, phone, address, city, state, zipCode,
        verificationToken, isVerified, createdAt, updatedAt
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      userId, name, email.toLowerCase(), hashedPassword, phone || null,
      address || null, city || null, state || null, zipCode || null,
      verificationToken, 0, now, now
    ]);
    
    // Generate tokens
    const user = {
      _id: userId,
      name,
      email: email.toLowerCase(),
      role: 'user'
    };
    
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);
    
    // Store refresh token
    const userAgent = req.headers['user-agent'];
    const ipAddress = req.ip || req.connection.remoteAddress;
    await storeRefreshToken(userId, refreshToken, userAgent, ipAddress);
    
    // Get the created user (without password)
    const createdUser = await db.get(
      `SELECT _id, name, email, role, avatar, phone, address, city, state, zipCode, isVerified, createdAt
       FROM users WHERE _id = ?`,
      [userId]
    );
    
    res.status(201).json({
      success: true,
      data: {
        user: createdUser,
        accessToken,
        refreshToken
      }
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Login user
// @route   POST /api/users/login
// @access  Public
router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const db = getDb();
    
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password'
      });
    }
    
    // Get user with password
    const user = await db.get('SELECT * FROM users WHERE email = ?', [email.toLowerCase()]);
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }
    
    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }
    
    // Update last login
    await db.run(
      'UPDATE users SET lastLogin = ?, updatedAt = ? WHERE _id = ?',
      [new Date().toISOString(), new Date().toISOString(), user._id]
    );
    
    // Generate tokens
    const userPayload = {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    };
    
    const accessToken = generateAccessToken(userPayload);
    const refreshToken = generateRefreshToken(userPayload);
    
    // Store refresh token
    const userAgent = req.headers['user-agent'];
    const ipAddress = req.ip || req.connection.remoteAddress;
    await storeRefreshToken(user._id, refreshToken, userAgent, ipAddress);
    
    // Return user without password
    const { password: _, ...userWithoutPassword } = user;
    
    res.json({
      success: true,
      data: {
        user: userWithoutPassword,
        accessToken,
        refreshToken
      }
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Refresh access token
// @route   POST /api/users/refresh-token
// @access  Public
router.post('/refresh-token', async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    
    if (!refreshToken) {
      return res.status(400).json({
        success: false,
        message: 'Refresh token required'
      });
    }
    
    const user = await verifyRefreshToken(refreshToken);
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired refresh token'
      });
    }
    
    const accessToken = generateAccessToken(user);
    const newRefreshToken = generateRefreshToken(user);
    
    // Revoke old refresh token and store new one
    await revokeRefreshToken(user._id, refreshToken);
    
    const userAgent = req.headers['user-agent'];
    const ipAddress = req.ip || req.connection.remoteAddress;
    await storeRefreshToken(user._id, newRefreshToken, userAgent, ipAddress);
    
    res.json({
      success: true,
      data: {
        accessToken,
        refreshToken: newRefreshToken
      }
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Logout user
// @route   POST /api/users/logout
// @access  Private
router.post('/logout', protect, async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    const db = getDb();
    
    if (refreshToken) {
      await revokeRefreshToken(req.user._id, refreshToken);
    } else {
      // If no specific token, revoke all sessions (optional)
      // await revokeAllUserSessions(req.user._id);
    }
    
    res.json({
      success: true,
      message: 'Logged out successfully'
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Get current user profile
// @route   GET /api/users/profile
// @access  Private
router.get('/profile', protect, async (req, res, next) => {
  try {
    const db = getDb();
    
    const user = await db.get(
      `SELECT _id, name, email, role, avatar, phone, address, city, state, zipCode, 
              isVerified, createdAt, lastLogin
       FROM users WHERE _id = ?`,
      [req.user._id]
    );
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
router.put('/profile', protect, async (req, res, next) => {
  try {
    const { name, phone, address, city, state, zipCode, avatar } = req.body;
    const db = getDb();
    
    const updates = [];
    const values = [];
    
    if (name) {
      updates.push('name = ?');
      values.push(name);
    }
    if (phone !== undefined) {
      updates.push('phone = ?');
      values.push(phone);
    }
    if (address !== undefined) {
      updates.push('address = ?');
      values.push(address);
    }
    if (city !== undefined) {
      updates.push('city = ?');
      values.push(city);
    }
    if (state !== undefined) {
      updates.push('state = ?');
      values.push(state);
    }
    if (zipCode !== undefined) {
      updates.push('zipCode = ?');
      values.push(zipCode);
    }
    if (avatar !== undefined) {
      updates.push('avatar = ?');
      values.push(avatar);
    }
    
    updates.push('updatedAt = ?');
    values.push(new Date().toISOString());
    values.push(req.user._id);
    
    if (updates.length > 1) {
      await db.run(
        `UPDATE users SET ${updates.join(', ')} WHERE _id = ?`,
        values
      );
    }
    
    const updatedUser = await db.get(
      `SELECT _id, name, email, role, avatar, phone, address, city, state, zipCode, 
              isVerified, createdAt, lastLogin
       FROM users WHERE _id = ?`,
      [req.user._id]
    );
    
    res.json({
      success: true,
      data: updatedUser
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Change password
// @route   PUT /api/users/change-password
// @access  Private
router.put('/change-password', protect, async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const db = getDb();
    
    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Please provide current and new password'
      });
    }
    
    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'New password must be at least 6 characters'
      });
    }
    
    const user = await db.get('SELECT password FROM users WHERE _id = ?', [req.user._id]);
    
    const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
    
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Current password is incorrect'
      });
    }
    
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    
    await db.run(
      'UPDATE users SET password = ?, updatedAt = ? WHERE _id = ?',
      [hashedPassword, new Date().toISOString(), req.user._id]
    );
    
    // Revoke all sessions after password change for security
    await revokeAllUserSessions(req.user._id);
    
    res.json({
      success: true,
      message: 'Password changed successfully. Please login again.'
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Forgot password - send reset token
// @route   POST /api/users/forgot-password
// @access  Public
router.post('/forgot-password', async (req, res, next) => {
  try {
    const { email } = req.body;
    const db = getDb();
    
    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email address'
      });
    }
    
    const user = await db.get('SELECT _id, email FROM users WHERE email = ?', [email.toLowerCase()]);
    
    if (!user) {
      // Don't reveal that user doesn't exist for security
      return res.json({
        success: true,
        message: 'If an account exists with that email, you will receive a password reset link'
      });
    }
    
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetExpires = Date.now() + 3600000; // 1 hour
    
    await db.run(
      'UPDATE users SET resetPasswordToken = ?, resetPasswordExpires = ? WHERE _id = ?',
      [resetToken, resetExpires, user._id]
    );
    
    // In production, send email here
    // For now, return the token in response (for testing)
    const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`;
    
    res.json({
      success: true,
      message: 'Password reset link sent',
      resetToken: process.env.NODE_ENV === 'development' ? resetToken : undefined,
      resetUrl: process.env.NODE_ENV === 'development' ? resetUrl : undefined
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Reset password with token
// @route   POST /api/users/reset-password
// @access  Public
router.post('/reset-password', async (req, res, next) => {
  try {
    const { token, newPassword } = req.body;
    const db = getDb();
    
    if (!token || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Please provide token and new password'
      });
    }
    
    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters'
      });
    }
    
    const user = await db.get(
      `SELECT _id FROM users 
       WHERE resetPasswordToken = ? AND resetPasswordExpires > ?`,
      [token, Date.now()]
    );
    
    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired reset token'
      });
    }
    
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    
    await db.run(
      `UPDATE users 
       SET password = ?, resetPasswordToken = NULL, resetPasswordExpires = NULL, updatedAt = ?
       WHERE _id = ?`,
      [hashedPassword, new Date().toISOString(), user._id]
    );
    
    // Revoke all sessions after password reset
    await revokeAllUserSessions(user._id);
    
    res.json({
      success: true,
      message: 'Password reset successfully. Please login with your new password.'
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Verify email
// @route   GET /api/users/verify-email/:token
// @access  Public
router.get('/verify-email/:token', async (req, res, next) => {
  try {
    const { token } = req.params;
    const db = getDb();
    
    const user = await db.get(
      'SELECT _id FROM users WHERE verificationToken = ? AND isVerified = 0',
      [token]
    );
    
    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired verification token'
      });
    }
    
    await db.run(
      'UPDATE users SET isVerified = 1, verificationToken = NULL, updatedAt = ? WHERE _id = ?',
      [new Date().toISOString(), user._id]
    );
    
    res.json({
      success: true,
      message: 'Email verified successfully'
    });
  } catch (error) {
    next(error);
  }
});

// ============ ADMIN ONLY ROUTES ============

// @desc    Get all users (admin only)
// @route   GET /api/users
// @access  Private/Admin
router.get('/', protect, admin, async (req, res, next) => {
  try {
    const db = getDb();
    const { page = 1, limit = 20, search, role } = req.query;
    
    let query = 'SELECT _id, name, email, role, phone, isVerified, createdAt, lastLogin FROM users WHERE 1=1';
    const params = [];
    
    if (search) {
      query += ' AND (name LIKE ? OR email LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }
    
    if (role && role !== 'all') {
      query += ' AND role = ?';
      params.push(role);
    }
    
    // Get total count
    const countResult = await db.get(`SELECT COUNT(*) as total FROM (${query})`, params);
    const total = countResult?.total || 0;
    
    // Add pagination
    const offset = (page - 1) * limit;
    query += ' ORDER BY createdAt DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), offset);
    
    const users = await db.all(query, params);
    
    res.json({
      success: true,
      data: users,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Get single user (admin only)
// @route   GET /api/users/:id
// @access  Private/Admin
router.get('/:id', protect, admin, async (req, res, next) => {
  try {
    const { id } = req.params;
    const db = getDb();
    
    const user = await db.get(
      `SELECT _id, name, email, role, avatar, phone, address, city, state, zipCode, 
              isVerified, createdAt, lastLogin
       FROM users WHERE _id = ?`,
      [id]
    );
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    // Get user stats
    const orderCount = await db.get('SELECT COUNT(*) as count FROM orders WHERE user_id = ?', [id]);
    const wishlistCount = await db.get('SELECT COUNT(*) as count FROM wishlist WHERE user_id = ?', [id]);
    
    res.json({
      success: true,
      data: {
        ...user,
        stats: {
          orders: orderCount?.count || 0,
          wishlist: wishlistCount?.count || 0
        }
      }
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Update user role (admin only)
// @route   PUT /api/users/:id/role
// @access  Private/Admin
router.put('/:id/role', protect, admin, async (req, res, next) => {
  try {
    const { id } = req.params;
    const { role } = req.body;
    const db = getDb();
    
    if (!role || !['user', 'admin'].includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'Valid role (user/admin) is required'
      });
    }
    
    const user = await db.get('SELECT _id FROM users WHERE _id = ?', [id]);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    await db.run(
      'UPDATE users SET role = ?, updatedAt = ? WHERE _id = ?',
      [role, new Date().toISOString(), id]
    );
    
    // Revoke all sessions after role change
    await revokeAllUserSessions(id);
    
    res.json({
      success: true,
      message: `User role updated to ${role}`
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Delete user (admin only)
// @route   DELETE /api/users/:id
// @access  Private/Admin
router.delete('/:id', protect, admin, async (req, res, next) => {
  try {
    const { id } = req.params;
    const db = getDb();
    
    if (id === req.user._id) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete your own account'
      });
    }
    
    const user = await db.get('SELECT _id FROM users WHERE _id = ?', [id]);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    await db.run('DELETE FROM users WHERE _id = ?', [id]);
    
    res.json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;