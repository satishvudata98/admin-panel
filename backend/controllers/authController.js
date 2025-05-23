// backend/controllers/authController.js
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const supabase = require('../config/supabaseClient');
const { 
  accessTokenSecret, 
  refreshTokenSecret,
  accessTokenExpiry,
  refreshTokenExpiry 
} = require('../config/jwtConfig');

// Helper function to generate tokens
const generateTokens = (userId) => {
  const accessToken = jwt.sign(
    { userId },
    accessTokenSecret,
    { expiresIn: accessTokenExpiry }
  );
  
  const refreshToken = jwt.sign(
    { userId, tokenId: uuidv4() },
    refreshTokenSecret,
    { expiresIn: refreshTokenExpiry }
  );
  
  return { accessToken, refreshToken };
};

// Store refresh token in database
const storeRefreshToken = async (userId, refreshToken) => {
  const { error } = await supabase
    .from('refresh_tokens')
    .insert([{ 
      user_id: userId, 
      token: refreshToken,
      expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
    }]);
    
  if (error) throw error;
};

exports.registerUser = async (req, res) => {
  const { name, email, password } = req.body;
  
  try {
    // Check if user exists
    const { data: existingUsers, error: selectError } = await supabase
      .from('users')
      .select('*')
      .eq('email', email);
      
    if (selectError) throw selectError;
    if (existingUsers.length > 0) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    // Hash password and create user
    const hashedPassword = await bcrypt.hash(password, 10);
    const { data: insertedUser, error: insertError } = await supabase
      .from('users')
      .insert([{ name, email, password: hashedPassword }])
      .select('id, name, email')
      .single();

    if (insertError) throw insertError;

    // Generate tokens
    const { accessToken, refreshToken } = generateTokens(insertedUser.id);
    
    // Store refresh token
    await storeRefreshToken(insertedUser.id, refreshToken);

    res.status(201).json({ 
      user: insertedUser,
      accessToken,
      refreshToken
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.loginUser = async (req, res) => {
  const { email, password } = req.body;
  
  try {
    // Find user
    const { data: users, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email);

    if (error) throw error;
    if (users.length === 0) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const user = users[0];
    
    // Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Generate tokens
    const { accessToken, refreshToken } = generateTokens(user.id);
    
    // Store refresh token
    await storeRefreshToken(user.id, refreshToken);

    res.status(200).json({
      message: 'Login successful',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
      accessToken,
      refreshToken
    });
  } catch (err) {
    console.error('Login error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.refreshToken = async (req, res) => {
  const { refreshToken } = req.body;
  
  if (!refreshToken) {
    return res.status(401).json({ message: 'Refresh token required' });
  }

  try {
    // Verify refresh token
    const decoded = jwt.verify(refreshToken, refreshTokenSecret);
    
    // Check if token exists in database
    const { data: tokens, error: tokenError } = await supabase
      .from('refresh_tokens')
      .select('*')
      .eq('token', refreshToken)
      .eq('user_id', decoded.userId)
      .gt('expires_at', new Date());
      
    if (tokenError) throw tokenError;
    if (tokens.length === 0) {
      return res.status(403).json({ message: 'Invalid refresh token' });
    }

    // Generate new tokens
    const { accessToken, refreshToken: newRefreshToken } = generateTokens(decoded.userId);
    
    // Delete old refresh token
    await supabase
      .from('refresh_tokens')
      .delete()
      .eq('token', refreshToken);
    
    // Store new refresh token
    await storeRefreshToken(decoded.userId, newRefreshToken);

    res.json({ 
      accessToken, 
      refreshToken: newRefreshToken 
    });
  } catch (err) {
    console.error('Refresh token error:', err);
    return res.status(403).json({ message: 'Invalid refresh token' });
  }
};

exports.logoutUser = async (req, res) => {
  const { refreshToken } = req.body;
  
  if (!refreshToken) {
    return res.status(400).json({ message: 'Refresh token required' });
  }

  try {
    // Delete refresh token from database
    const { error } = await supabase
      .from('refresh_tokens')
      .delete()
      .eq('token', refreshToken);
      
    if (error) throw error;
    
    res.status(200).json({ message: 'Logout successful' });
  } catch (err) {
    console.error('Logout error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Middleware to verify access token
exports.verifyToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  try {
    const decoded = jwt.verify(token, accessTokenSecret);
    req.userId = decoded.userId;
    next();
  } catch (err) {
    console.error('Token verification error:', err);
    res.status(403).json({ message: 'Invalid or expired token' });
  }
};


exports.validateSession = async (req, res) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    // Verify using the correct secret from config
    jwt.verify(token, accessTokenSecret, (err, decoded) => {
      if (err) {
        return res.status(403).json({ 
          message: 'Invalid or expired token',
          code: 'SESSION_EXPIRED'
        });
      }
      
      res.status(200).json({ 
        message: 'Session is valid',
        user: {
          id: decoded.userId,
        }
      });
    });
    
  } catch (err) {
    console.error('Session validation error:', err);
    res.status(500).json({ message: 'Server error during session validation' });
  }
};