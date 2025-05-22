const bcrypt = require('bcrypt');
const pool = require('../config/db');

exports.registerUser = async (req, res) => {
  const { name, email, password } = req.body;
  
  try {
    // const existingUser = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    const existingUser = await pool`SELECT * FROM users WHERE email = ${email}`;
    const rows = Array.isArray(existingUser) ? existingUser : existingUser.rows;
    if (rows.length > 0) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // const result = await pool.query(
    //   'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email',
    //   [name, email, hashedPassword]
    // );
    const result = await pool`INSERT INTO users (name, email, password) VALUES (${name}, ${email}, ${hashedPassword}) RETURNING id, name, email`;
    const rowsInserted = Array.isArray(result) ? result : result.rows;
    res.status(201).json({ user: rowsInserted[0] });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    // const userResult = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    const userResult = await pool`SELECT * FROM users WHERE email = ${email}`;
    const rows = Array.isArray(userResult) ? userResult : userResult.rows;
    if (rows.length === 0) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const user = rows[0];

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    res.status(200).json({
      message: 'Login successful',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (err) {
    console.error('Login error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
};
