const jwt = require('jsonwebtoken');
require('dotenv').config();

const signToken = (id) =>
  jwt.sign({ id, type: 'user' }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '30d' });

const token = signToken('6a103de4b6c85062458f4b0d');
console.log('Signed token:', token);

// Verify it
try {
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  console.log('Decoded successfully:', decoded);
} catch (err) {
  console.error('Verify failed:', err);
}
